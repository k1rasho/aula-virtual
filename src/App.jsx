import React, { useMemo, useState, useEffect } from "react";

// --- Datos simulados (remplaza luego por tu BD) ---
const SEED = {
  ciclos: [
    { id: "biomedicas", nombre: "Biomédicas", icon: "🧬" },
    { id: "ingenierias", nombre: "Ingenierías", icon: "⚙️" },
    { id: "fisica-quimica", nombre: "Física–Química", icon: "🧪" },
    { id: "bio-anatomia", nombre: "Bio–Anatomía", icon: "🦴" },
    { id: "rm-rv", nombre: "RM y RV", icon: "🧠" },
  ],
  cursos: [
    { id: "bio101", ciclo: "biomedicas", titulo: "Biología General", docente: "Mg. Valdez" },
    { id: "anato1", ciclo: "bio-anatomia", titulo: "Anatomía I", docente: "Dr. Soria" },
    { id: "fisq1", ciclo: "fisica-quimica", titulo: "Fisicoquímica", docente: "Ing. Paredes" },
    { id: "rm1", ciclo: "rm-rv", titulo: "Razonamiento Matemático", docente: "Lic. Avendaño" },
    { id: "rv1", ciclo: "rm-rv", titulo: "Razonamiento Verbal", docente: "Lic. Huamán" },
  ],
  recursos: [
    { id: "r1", curso: "bio101", tipo: "pdf", titulo: "Síntesis de proteínas (apuntes)", url: "https://arxiv.org/pdf/1707.08567.pdf" },
    { id: "r2", curso: "bio101", tipo: "video", titulo: "Replicación del ADN (YouTube)", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    { id: "r3", curso: "rm1", tipo: "pdf", titulo: "Álgebra básica – guía", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
    { id: "r4", curso: "rm1", tipo: "video", titulo: "Técnicas de factorización", url: "https://www.youtube.com/watch?v=5MgBikgcWnY" },
  ],
  usuarios: [
    { id: "admin", nombre: "Admin", rol: "admin", email: "admin@vesalius.edu", pass: "123456" },
    { id: "alumno1", nombre: "María", rol: "alumno", email: "maria@vesalius.edu", pass: "123456" },
  ],
};

// --- Utilidades ---
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
};

// --- Componentes UI simples ---
const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl shadow p-4 bg-white ${className}`}>{children}</div>
);
const Button = ({ children, className = "", ...props }) => (
  <button className={`px-4 py-2 rounded-xl shadow text-white bg-blue-600 hover:bg-blue-700 active:scale-[.98] ${className}`} {...props}>
    {children}
  </button>
);
const Input = (props) => (
  <input {...props} className={`w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${props.className||""}`} />
);

// --- Autenticación fake (luego cambia a Supabase/Firebase) ---
function useAuth() {
  const [user, setUser] = useState(load("user", null));
  const login = (email, pass) => {
    const u = SEED.usuarios.find((x) => x.email === email && x.pass === pass);
    if (!u) throw new Error("Credenciales inválidas");
    setUser(u); save("user", u);
  };
  const logout = () => { setUser(null); save("user", null); };
  return { user, login, logout };
}

// --- Sidebar de ciclos ---
function Sidebar({ ciclos, activo, onSelect }) {
  return (
    <aside className=" bg-[url('/hola.jpeg')] bg-cover bg-center p-6">
      <h3 className="text-lg font-semibold mb-3">Ciclos</h3>
      <div className="space-y-2">
        {ciclos.map((c) => (
          <button key={c.id} onClick={() => onSelect(c.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl border ${activo===c.id?"bg-blue-50 border-blue-400":"hover:bg-gray-50"}`}>
            <span className="text-xl">{c.icon}</span>
            <span className="text-left">{c.nombre}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}

// --- Lista de cursos ---
function CursosList({ cursos, onOpen }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cursos.map((c) => (
        <Card key={c.id}>
          <div className="flex flex-col gap-2">
            <h4 className="text-lg font-semibold">{c.titulo}</h4>
            <p className="text-sm text-gray-600">Docente: {c.docente}</p>
            <Button onClick={() => onOpen(c.id)}>Ver recursos</Button>
          </div>
        </Card>
      ))}
      {cursos.length===0 && (
        <Card><p>No hay cursos en este ciclo.</p></Card>
      )}
    </div>
  );
}

// --- Detalle de curso + recursos ---
function CursoDetalle({ curso, recursos, onBack }) {
  const ytId = (url) => {
    try { const u = new URL(url); const v = u.searchParams.get("v"); if (v) return v; } catch {}
    return null;
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button className="bg-gray-600 hover:bg-gray-700" onClick={onBack}>← Volver</Button>
        <h3 className="text-xl font-bold">{curso.titulo}</h3>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {recursos.map((r) => (
          <Card key={r.id}>
            <p className="font-medium mb-2">{r.titulo}</p>
            {r.tipo === "pdf" && (
              <a className="text-blue-600 underline" href={r.url} target="_blank" rel="noreferrer">Abrir PDF</a>
            )}
            {r.tipo === "video" && (
              ytId(r.url) ? (
                <div className="aspect-video w-full">
                  <iframe className="w-full h-full rounded-xl" src={`https://www.youtube.com/embed/${ytId(r.url)}`} title={r.titulo} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
              ) : (
                <a className="text-blue-600 underline" href={r.url} target="_blank" rel="noreferrer">Ver en YouTube</a>
              )
            )}
          </Card>
        ))}
      </div>
      {recursos.length===0 && <Card>No hay recursos aún.</Card>}
    </div>
  );
}

// --- Panel Admin: creación rápida de cursos/recursos (localStorage) ---
function AdminPanel({ data, setData }) {
  const [curso, setCurso] = useState({ titulo: "", ciclo: data.ciclos[0].id, docente: "" });
  const [recurso, setRecurso] = useState({ curso: "", tipo: "pdf", titulo: "", url: "" });

  useEffect(() => {
    if (!recurso.curso && data.cursos.length) setRecurso((r)=>({...r, curso: data.cursos[0].id}));
  }, [data.cursos]);

  const addCurso = () => {
    const id = curso.titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-") + Date.now();
    const nuevo = { id, ...curso };
    const cursos = [...data.cursos, nuevo];
    const next = { ...data, cursos }; setData(next); save("data", next);
    setCurso({ titulo: "", ciclo: data.ciclos[0].id, docente: "" });
  };
  const addRecurso = () => {
    const id = "r" + Math.random().toString(36).slice(2,7);
    const recursos = [...data.recursos, { id, ...recurso }];
    const next = { ...data, recursos }; setData(next); save("data", next);
    setRecurso({ curso: data.cursos[0]?.id || "", tipo: "pdf", titulo: "", url: "" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-bold mb-3">Crear curso</h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className="text-sm">Título</label>
            <Input value={curso.titulo} onChange={(e)=>setCurso({...curso, titulo: e.target.value})} placeholder="Ej. Cálculo I" />
          </div>
          <div>
            <label className="text-sm">Docente</label>
            <Input value={curso.docente} onChange={(e)=>setCurso({...curso, docente: e.target.value})} placeholder="Nombre del docente" />
          </div>
          <div>
            <label className="text-sm">Ciclo</label>
            <select className="w-full border rounded-xl px-3 py-2" value={curso.ciclo} onChange={(e)=>setCurso({...curso, ciclo: e.target.value})}>
              {data.ciclos.map(c=> <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3"><Button onClick={addCurso}>Guardar curso</Button></div>
      </Card>

      <Card>
        <h3 className="font-bold mb-3">Agregar recurso</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <div>
            <label className="text-sm">Curso</label>
            <select className="w-full border rounded-xl px-3 py-2" value={recurso.curso} onChange={(e)=>setRecurso({...recurso, curso: e.target.value})}>
              {data.cursos.map(c=> <option key={c.id} value={c.id}>{c.titulo}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm">Tipo</label>
            <select className="w-full border rounded-xl px-3 py-2" value={recurso.tipo} onChange={(e)=>setRecurso({...recurso, tipo: e.target.value})}>
              <option value="pdf">PDF</option>
              <option value="video">YouTube</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Título</label>
            <Input value={recurso.titulo} onChange={(e)=>setRecurso({...recurso, titulo: e.target.value})} placeholder="Ej. Semana 1" />
          </div>
          <div>
            <label className="text-sm">URL</label>
            <Input value={recurso.url} onChange={(e)=>setRecurso({...recurso, url: e.target.value})} placeholder="https://..." />
          </div>
        </div>
        <div className="mt-3"><Button onClick={addRecurso}>Guardar recurso</Button></div>
      </Card>
    </div>
  );
}

// --- Layout principal ---
export default function App() {
  const { user, login, logout } = useAuth();
  const [data, setData] = useState(load("data", SEED));
  const [ciclo, setCiclo] = useState(data.ciclos[0].id);
  const [cursoAbierto, setCursoAbierto] = useState(null);

  const cursosFiltrados = useMemo(() => data.cursos.filter(c => c.ciclo === ciclo), [data, ciclo]);
  const curso = useMemo(() => data.cursos.find(c => c.id === cursoAbierto) || null, [data, cursoAbierto]);
  const recursosCurso = useMemo(() => data.recursos.filter(r => r.curso === cursoAbierto), [data, cursoAbierto]);

  // Seed inicial una sola vez
  useEffect(()=>{
    if (!load("seeded", false)) { save("data", SEED); save("seeded", true); }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 grid place-items-center p-4">
        <Card className="w-full max-w-md">
          <h1 className="text-2xl font-black">Aula Virtual</h1>
          <p className="text-sm text-gray-600 mb-4">Inicia sesión para acceder a tus cursos.</p>
          <LoginForm onLogin={login} />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">Aula Virtual</h1>
          <p className="text-gray-600 text-sm">Usuario: {user.nombre} · Rol: <b>{user.rol}</b></p>
        </div>
        <div className="flex gap-2">
          {user.rol === "admin" && <Button onClick={()=>alert("Tip: ve al panel ‘Admin’ al final para crear cursos y recursos. Luego conecta a tu BD.")}>Guía rápida</Button>}
          <Button className="bg-gray-700 hover:bg-gray-800" onClick={logout}>Salir</Button>
        </div>
      </header>

      <main className="grid md:grid-cols-[260px,1fr] gap-6">
        <Sidebar ciclos={data.ciclos} activo={ciclo} onSelect={setCiclo} />

        <div className="space-y-6">
          {!curso && (
            <>
              <Card>
                <h2 className="text-xl font-bold mb-2">Cursos del ciclo seleccionado</h2>
                <p className="text-gray-600 text-sm">Elige un curso para ver sus PDFs y videos.</p>
              </Card>
              <CursosList cursos={cursosFiltrados} onOpen={setCursoAbierto} />
            </>
          )}

          {curso && (
            <CursoDetalle curso={curso} recursos={recursosCurso} onBack={()=>setCursoAbierto(null)} />
          )}

          {user.rol === "admin" && (
            <Card className="border-2 border-dashed border-blue-300">
              <h2 className="text-xl font-bold mb-2">Panel de Administración</h2>
              <p className="text-gray-600 mb-4 text-sm">Crea cursos y agrega recursos.</p>
              <AdminPanel data={data} setData={setData} />
            </Card>
          )}
        </div>
      </main>

      <footer className="mt-12 text-center text-xs text-gray-500">
         hola soy cabro 
      </footer>
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("admin@vesalius.edu");
  const [pass, setPass] = useState("123456");
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault(); setError("");
    try { onLogin(email, pass); } catch (err) { setError(err.message); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-sm">Correo institucional</label>
        <Input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" required />
      </div>
      <div>
        <label className="text-sm">Contraseña</label>
        <Input value={pass} onChange={(e)=>setPass(e.target.value)} type="password" required />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button type="submit" className="w-full">Ingresar</Button>
      <p className="text-xs text-gray-500">hola</p>
    </form>
  );
}
