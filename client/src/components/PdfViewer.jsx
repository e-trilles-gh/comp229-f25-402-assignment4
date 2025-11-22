export default function PdfViewer() {
  return (
    <>
      <h2>About</h2>
      <div className="leftMessage">Welcome to my About Page</div>
      <div className="pdfContainer">
        <embed
          src="/resume.pdf"
          width="100%"
          height="100%"
          type="application/pdf"
        />
      </div>
    </>
  );
}