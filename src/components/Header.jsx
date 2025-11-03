function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg p-5 flex gap-3 animate-fadeIn">
      <span className="text-4xl">🎥</span>
      <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-md">
        Movie List App
      </h1>
    </header>
  );
}

export default Header;
