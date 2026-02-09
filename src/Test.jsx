function Test() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Tailwind Test</h1>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        If this is green with rounded corners, Tailwind is working!
      </div>
      <button className="btn-primary">Test Button</button>
      <input type="text" className="input mt-4" placeholder="Test input" />
    </div>
  );
}

export default Test;