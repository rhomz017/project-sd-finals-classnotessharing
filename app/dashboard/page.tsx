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
    user = jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/login");
  }

  const result = await db.query(
    "SELECT * FROM notes ORDER BY created_at DESC"
  );

  const notes = result.rows || [];

  return (
    <div className="home">
      <div className="center-wrapper">
        <div className="login-box">
          <h2>📘 Class Notes Sharing</h2>

          <p>
            Welcome, <b>{user.name || "User"}</b>
          </p>

          <UploadForm />

          <hr />

          <h3>📂 Available Notes</h3>

          {notes.length === 0 ? (
            <p>No notes uploaded yet.</p>
          ) : (
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

                    <td>
                      {new Date(row.created_at).toLocaleDateString()}
                    </td>

                    <td>
                      <a href={row.file_url} target="_blank">
                        Download
                      </a>
                    </td>

                    <td>
                      {user.userId === row.user_id ? (
                        <form action={`/api/delete?id=${row.id}`}>
                          <button type="submit">Delete</button>
                        </form>
                      ) : (
                        "Owner Only"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: "20px" }}>
            <a href="/about">About This Website</a> |{" "}
            <a href="/api/logout">Logout</a>
          </div>
        </div>
      </div>
    </div>
  );
}