# Probability

## What is Probability
Probability is the measure of likelihood of an event happening. It's always a number between 0 and 1:
- 0 means the event is impossible.
- 1 means the event is certain.
- Any value between 0 & 1 reflects how likely the event occurs.

## Example
If you flip a fair coin:
- The probability of getting heads is 0.5 (50% chance).
- The probability of getting tails is also 0.5 (50% chance).

## Basic Probability Formula
The probability \( P \) of an event \( E \) can be calculated using the formula:
```
P(E) = Number of favorable outcomes / Total number of possible outcomes = n(E) / n(S)
Where:
- P(E) is the probability of event E.
- n(E) is the number of favorable outcomes for event E.
- n(S) is the total number of possible outcomes in the sample space.
```

## Example Calculation
If you roll a fair six-sided die:
- The probability of rolling a 3 is:
\[ P(3) = 1/6 \]
- The probability of rolling an even number (2, 4, or 6) is:
\[ P(even) = 3/6 = 1/2 \]

## Important Concepts
### Sample Space
The sample space is the set of all possible outcomes of an experiment. For example, when rolling a die, the sample space is:
\[ S = \{1, 2, 3, 4, 5, 6\} \]
### Event
An event is a subset of the sample space. For example, the event of rolling an even number is:
\[ E = \{2, 4, 6\} \]
### Complement
The complement of an event \( E \) is the set of outcomes in the sample space that are not in \( E \). If \( E \) is rolling an even number, then the complement \( E' \) is:
\[ E' = \{1, 3, 5\} \]
### Independent Events
Two events are independent if the occurrence of one does not affect the occurrence of the other. For example, flipping a coin and rolling a die are independent events.
### Dependent Events
Two events are dependent if the occurrence of one affects the occurrence of the other. For example, drawing cards from a deck without replacement is a dependent event.

----

## Expected Values
The expected value (EV) is a measure of the center of a probability distribution. It represents the average outcome if an experiment were repeated many times.
The expected value \( E(X) \) of a random variable \( X \) can be calculated as:
```math
E(X) = (x_0 * P(x_0)) + (x_1 * P(x_1) + ... +  (x_i * P(x_i))
where ( x_i ) are the possible outcomes and ( P(x_i) ) is the probability of each outcome.
```

## Example of Expected Value
If you have a game where you win $10 with a probability of 0.2, lose $5 with a probability of 0.5, and break even with a probability of 0.3, the expected value is calculated as follows:
```math
E(X) = (10 * 0.2) + (-5 * 0.5) + (0 * 0.3)
E(X) = 2 - 2.5 + 0 = -0.5
```
This means, on average, you would lose $0.50 per game played.

## Conclusion
Probability is a fundamental concept in statistics and mathematics that helps us quantify uncertainty. Understanding the basic principles of probability, including sample space, events, and expected values, allows us to make informed decisions based on likelihoods and outcomes. Whether in games, risk assessment, or everyday situations, probability plays a crucial role in analyzing and predicting events.