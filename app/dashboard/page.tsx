import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import UploadForm from "@/components/UploadForm";
import db from "@/lib/db";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) redirect("/login");

  let user: any;

  try {
    user = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch {
    redirect("/login");
  }

  
  const result = await db.query(
    "SELECT * FROM notes ORDER BY id DESC"
    
  );

  const notes = result.rows;

  return (
    <div className="home">
      <div className="center-wrapper">
        <div className="login-box">
          <h2>📘 Class Notes Sharing</h2>

          <p className="welcome-text">
            Welcome, <span className="user-name">{user.name}</span>
          </p>

          <UploadForm />

          <hr style={{ margin: "20px 0" }} />

          <h3>📂 Available Notes</h3>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Download</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {notes.map((row: any) => (
                  <tr key={row.id}>
                    <td>{row.title}</td>
                    <td>{row.subject}</td>

                    {/* ✅ FIX: date rendering */}
                    <td>
                      {row.upload_date
                        ? new Date(row.upload_date).toLocaleDateString()
                        : "No date"}
                    </td>

                    <td>
                      <a href={row.file_path} download>
                        Download
                      </a>
                    </td>

                    <td>
                      {user.id === row.user_id ? (
                        <a href={`/api/delete?id=${row.id}`}>Delete</a>
                      ) : (
                        "Owner Only"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bottom-links" style={{ marginTop: "20px" }}>
            <a href="/about">About This Website</a> |{" "}
            <a href="/api/logout">Logout</a>
          </div>
        </div>
      </div>
    </div>
  );
}