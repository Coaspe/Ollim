const blocks = [
  {
    type: "page",
    title: "Page",
    icon: <>p</>,
    isHiddenInToolbar: true,
    renderBlock: ({ attributes, children }) => (
      <div
        className="page"
        {...attributes}
        style={{
          position: "relative",
          marginTop: "40px",
          marginBottom: "40px",
          width: "210mm",
          height: "50mm",
          background: "#fff",
        }}
      >
        {children}
      </div>
    ),
  },
];

export default blocks;
