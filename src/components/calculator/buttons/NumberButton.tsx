import Button from './Button';

export default function NumberButton({
  value,
  buttonSize = 1,
}: {
  value: number;
  buttonSize?: number;
}) {
  const addNumber = async () => {
    const currentExpression = await window.electron.calculator.getExpression();
    if (await window.electron.calculator.hasCalculated()) {
      // If it has calculated, then the next number should replace the current sum
      await window.electron.calculator.setExpression(`${value}`);
      return;
    }

    await window.electron.calculator.setExpression(
      `${currentExpression}${value}`
    );
  };

  return <Button text={`${value}`} size={buttonSize} action={addNumber} />;
}
