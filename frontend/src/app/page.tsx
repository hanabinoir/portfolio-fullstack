export default function HomePage() {
  return (
    <main className="container">
      <p className="eyebrow">Bilingual developer portfolio</p>
      <h1>Portfolio starter</h1>
      <p>
        This starter is ready for GitHub Copilot to implement the Profile,
        Experiences, and Skills tabs.
      </p>
      <nav aria-label="Main sections">
        <a href="#profile">Profile</a>
        <a href="#experiences">Experiences</a>
        <a href="#skills">Skills</a>
      </nav>
      <section id="profile">
        <h2>Profile</h2>
        <p>Profile content will be loaded from the Django API.</p>
      </section>
      <section id="experiences">
        <h2>Experiences</h2>
        <p>Employment periods and nested projects will appear here.</p>
      </section>
      <section id="skills">
        <h2>Skills</h2>
        <p>Canonical technical skills will appear here.</p>
      </section>
    </main>
  );
}
