import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="about">
      <div className="login-box">
        <h2>About This Website</h2>

        <p className="about-text">
          This website is made for students to easily share and access class notes.
          Users can upload files such as images, PDFs, and documents so others can
          download and study them. It helps students learn better by sharing useful
          materials in a simple and organized way.
        </p>

        <div className="about-members">
          <b>Leader:</b> Araneta, Rommel
          <br /><br />

          <b>Members:</b>
          <br />
          De Mesa, Kaye
          <br />
          Hermo, Irish Kay
          <br />
          Perez, Jobert
          <br /><br />

          Course: BS Computer Engineering
        </div>

        <Link href="/dashboard" className="back-btn">
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
}