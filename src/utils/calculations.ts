import { OPERATORS, ORDER_OF_OPERATION } from './Constants';

function calculateInternal(
  firstValue: number,
  operator: string,
  secondValue: number
) {
  switch (operator) {
    case OPERATORS.add:
      return firstValue + secondValue;
    case OPERATORS.sub:
      return firstValue - secondValue;
    case OPERATORS.div:
      return firstValue / secondValue;
    case OPERATORS.mlt:
      return firstValue * secondValue;
    case OPERATORS.mod:
      return firstValue % secondValue;
    case OPERATORS.exp:
      return firstValue ** secondValue;
    default:
      return null;
  }
}

export default function calculate(input: string) {
  let calculationInput = input.replace(/[^0-9%^*\\/()\-+.]/g, ''); // clean up unnecessary characters

  let output;
  for (let i = 0; i < ORDER_OF_OPERATION.length; i += 1) {
    // Regular Expression to look for operators between floating numbers or integers
    const expressionRegex = new RegExp(
      `(-?\\d+\\.?\\d*)([${ORDER_OF_OPERATION[i].join('\\')}])(-?\\d+\\.?\\d*)`
    );

    // Loop while there is still calculation for level of precedence
    while (expressionRegex.test(calculationInput)) {
      output = calculateInternal(
        Number(RegExp.$1),
        RegExp.$2,
        Number(RegExp.$3)
      );

      // Check if the output is a number otherwise, return with the output.
      if (!output || Number.isNaN(output) || !Number.isFinite(output)) {
        return output;
      }

      calculationInput = calculationInput.replace(
        expressionRegex,
        output.toString()
      );
    }
  }

  return output;
}
