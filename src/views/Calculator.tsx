import MainDisplay from '../components/calculator/MainDisplay';
import ButtonLayout from '../components/calculator/layout/ButtonLayout';
import InvisibleDragRegion from '../components/InvisibleDragRegion';

export default function Calculator() {
  return (
    <>
      <InvisibleDragRegion />
      <MainDisplay />
      <ButtonLayout />
    </>
  );
}
