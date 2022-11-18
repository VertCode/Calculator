export default function InvisibleDragRegion() {
  // Make sure, the drag region will be rendered, since react will not render if empty

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '1rem',
        ['WebkitAppRegion' as string]: 'drag',
      }}
    />
  );
}
