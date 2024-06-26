function SnippetComponent({icon, text, onClickEvent, mode, isActive, onActivate}) {
  return (
    <div className={`cursor-pointer select-none border border-ai-b bg-ai-l px-4 py-5 rounded-xl ${isActive ? 'bg-blue-500' : ''}`} onClick={() => onActivate(mode)}>
      <span>{icon}</span>
      <div>{text}</div>
    </div>
  );
}

export default SnippetComponent;
