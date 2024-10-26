# quPython: Exploring higher-level quantum programming

This blog post introduces [quPython](https://github.com/frankharkins/qupython),
a personal project of mine that explores of what a more "Pythonic" quantum
programming experience might look like.

> Disclaimer: I work for IBM Quantum, but opinions on this blog are entirely my
> own and do not represent those of Qiskit or IBM.

## The current state of quantum programming

The most popular quantum computing SDKs generally work at the level of _quantum
circuits_: sequences of qubit-level operations on a fixed number of qubits.
Here's a simple quantum circuit created with Qiskit, the most popular quantum
SDK.

```python
from qiskit import QuantumCircuit

# Initialize circuit object
qc = QuantumCircuit(2, 2)

# Add qubit-level operations to the circuit
qc.h(0)      # "H" gate on qubit 0
qc.cx(0,1)   # "X" gate on qubit 1, conditioned on qubit 0
# Measure both qubits and store the result on the two classical bits
qc.measure((0,1),(0,1))

# Return a drawing of the program
qc.draw()
```
```output
     ┌───┐     ┌─┐   
q_0: ┤ H ├──■──┤M├───
     └───┘┌─┴─┐└╥┘┌─┐
q_1: ─────┤ X ├─╫─┤M├
          └───┘ ║ └╥┘
c: 2/═══════════╩══╩═
                0  1
```

Despite technically being Python, the circuit construction part _looks_ very
much like assembly code. This is not a mistake; modern quantum computers can
only handle short programs on a small number of qubits, and low level
programming gives precise control over these limited resources.

The previous code only defines the program. To execute it, you'll need to
transpile it for a specific computer and submit it to be executed. Qiskit's
recommended workflow hides as little as possible.

```python
from qiskit import transpile
from qiskit.primitives import Sampler

# You'd usually include information about the target backend here
tranpiled_qc = transpile(qc)

# Submit program for execution. This is just a local simulator for
# testing, other samplers submit jobs over the internet to run on
# real quantum computers.
job = Sampler().run([tranpiled_qc])

# After job completion, access raw bit values
job.result()[0].data.c.array
```
```output
array([[3],
       [0],
       [3],
       ...,
       [0],
       [3],
       [3]], dtype=uint8)
```

The output from this process is an array of bits. These bits are the values of
the program's classical bits at the end of the circuit. You can see the result
object actually contains an _array of arrays_ of bits; quantum circuits are
often non-deterministic so it's standard practice to execute the circuit many
times.

Something that I often thought about was how we could go one step up the
abstraction ladder. Specifically, how could we make writing and running quantum
programs feel more like modern classical programming languages? quPython is my
attempt to answer that question.

## Introducing quPython

quPython is a Python framework for writing quantum programs. It makes two novel
design decisions, from which everything else follows:

1. Quantum programs are (decorated) Python functions, no separate circuit
   objects.
2. Quantum operations are methods on the Qubit class.

This leads to quantum programs that look more like Python. Here's the same
program from the previous section as quPython code.

```python
from qupython import Qubit, quantum

@quantum
def two_qubit_example():
    # Initialize qubits as needed
    a, b = Qubit(), Qubit()

    # Mutate qubits with methods
    a.h()
    with a.as_control():
        b.x()

    # Return two classical bits (output of `.measure()`)
    return a.measure(), b.measure()
```

The `@quantum` decorator converts the function into a quantum program that can
be executed on a quantum computer. To run the program, just call
`two_qubit_example()`. quPython will compile it to a quantum circuit, execute it,
and return the results.

```python
>>> two_qubit_example()
(True, True)
```

These small changes make a big difference in how you write your programs.
Qubits feel like standard Python objects, which makes it natural to organise
quantum programs using classes and other Python features. To demonstrate, I
include a [logical qubit
example](https://github.com/frankharkins/quPython/blob/main/examples/logical-qubit.md)
in the repository.

quPython is very simple (I have a pretty tight [strangeness
budget](https://steveklabnik.com/writing/the-language-strangeness-budget/)),
but this approach opens doors to steal other great ideas from classical
programming languages. For example, type checking could make sure inputs and
outputs of quantum subroutines are restricted to certain states. This would be
especially useful since it's impossible to inspect the value of qubits at
runtime.

For now though, quPython is just a demo. If you're interested by it, trying it
out should only take five minutes: just `pip install qupython` and run the
[hello
world](https://github.com/frankharkins/quPython/tree/main?tab=readme-ov-file#qupython)
example in your favourite REPL. If you have any opinions or idea, please get in
touch; I'd love to hear them.
