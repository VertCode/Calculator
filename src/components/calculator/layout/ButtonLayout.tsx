import Button from '../buttons/Button';
import gridStyle from '../../../styles/grid.module.scss';
import OperatorButton from '../buttons/OperatorButton';
import NumberButton from '../buttons/NumberButton';
import { OPERATORS } from '../../../utils/Constants';

export type ButtonLayoutType = {
  text: string;
  size: number;
  onClick: () => void;
};

export default function ButtonLayout() {
  const handleDotInput = async () => {
    const currentSum = await window.electron.calculator.getExpression();

    if (
      (await window.electron.calculator.hasCalculated()) ||
      currentSum === ''
    ) {
      // If it has calculated, then the next number should replace the current sum
      await window.electron.calculator.setExpression('0.');
      return;
    }

    // If last character is an . then don't add another
    if (currentSum[currentSum.length - 1] === '.') {
      return;
    }

    // If any of the operators (Values of OPERATORS) are the last character, then add a 0 before the .
    if (Object.values(OPERATORS).includes(currentSum[currentSum.length - 1])) {
      await window.electron.calculator.setExpression(`${currentSum}0.`);
      return;
    }

    await window.electron.calculator.setExpression(`${currentSum}.`);
  };

  const handleCalculate = async () => {
    await window.electron.calculator.calculate(true);
  };

  const handleClear = async () => {
    await window.electron.calculator.clear();
  };

  return (
    <>
      <div className={gridStyle.row}>
        <Button text="AC" size={1} action={handleClear} />
        <OperatorButton operator="±" display="-" />
        <OperatorButton operator="%" />
        <OperatorButton operator="÷" />
        {...Array.from({ length: 3 }, (_, i) => (
          <NumberButton key={`number-${i + 1}`} value={i + 1} />
        ))}
        <OperatorButton operator="×" />
        {...Array.from({ length: 3 }, (_, i) => (
          <NumberButton key={`number-${i + 4}`} value={i + 4} />
        ))}
        <OperatorButton operator="-" />
        {...Array.from({ length: 3 }, (_, i) => (
          <NumberButton key={`number-${i + 7}`} value={i + 7} />
        ))}
        <OperatorButton operator="+" />
        <NumberButton value={0} buttonSize={2} />
        <Button text="." size={1} action={handleDotInput} />
        <Button text="=" size={1} action={handleCalculate} />
      </div>
    </>
  );
}
