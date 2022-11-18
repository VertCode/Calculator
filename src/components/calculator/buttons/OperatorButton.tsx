import Button from './Button';

export default function OperatorButton({
  operator,
  buttonSize = 1,
  display,
}: {
  operator: string;
  buttonSize?: number;
  display?: string;
}) {
  const addOperator = async () => {
    const currentAnswer = await window.electron.calculator.getAnswer();
    if (await window.electron.calculator.hasCalculated()) {
      // If it has calculated, it should use the previous answer as the first number
      await window.electron.calculator.setExpression(
        `${currentAnswer}${display ?? operator}`
      );
      return;
    }

    const currentExpression = await window.electron.calculator.getExpression();
    await window.electron.calculator.setExpression(
      `${currentExpression}${display ?? operator}`
    );
  };

  return <Button text={`${operator}`} size={buttonSize} action={addOperator} />;
}
