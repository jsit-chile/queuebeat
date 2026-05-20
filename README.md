# 🎤 QueueBeat — by JSIT

**Karaoke interactivo donde el público pide canciones desde su teléfono y el DJ controla la pantalla del local.**

Aplicación construida con **Vite + React 18 + TypeScript + Redux Toolkit + React Router + Tailwind CSS + Framer Motion + Lucide Icons**.

---

## 🚀 Quick start

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
# → abre http://localhost:5173

# 3. Build para producción
npm run build

# 4. Preview del build
npm run preview

# 5. Verificar tipos
npm run type-check
```

---

## 🏗️ Arquitectura

```
src/
├── app/                    # Configuración global de Redux
│   ├── store.ts            # configureStore
│   └── hooks.ts            # useAppDispatch, useAppSelector tipados
│
├── features/               # Slices de Redux Toolkit (feature-sliced)
│   ├── room/               # Info del local (venue)
│   ├── user/               # Sesión del usuario actual
│   ├── queue/              # Cola de solicitudes (pending/approved)
│   └── player/             # Estado del reproductor
│
├── pages/                  # Vistas principales (1 por ruta)
│   ├── LandingPage.tsx     # Post-QR scan
│   ├── SearchPage.tsx      # Búsqueda multi-plataforma
│   ├── DJPage.tsx          # Panel del moderador
│   └── UserPage.tsx        # Vista del asistente
│
├── components/             # Componentes reutilizables
│   ├── Nav.tsx             # Navegación superior
│   ├── Logo.tsx
│   ├── Modal.tsx           # Modal base con Framer Motion
│   ├── SongRequestModal.tsx
│   ├── YouTubePlayer.tsx   # Wrapper del IFrame API + overlays
│   └── ToastProvider.tsx   # Contexto de notificaciones
│
├── hooks/                  # Hooks personalizados
│   ├── useToast.ts
│   └── useYouTubePlayer.ts # Encapsula el YouTube IFrame Player
│
├── services/               # Capa de datos / APIs
│   └── catalog.ts          # Mock catalog (sustituir por YouTube Data API)
│
├── types/                  # Tipos TypeScript globales
│   └── index.ts
│
├── styles/
│   └── index.css           # Tailwind + estilos globales
│
├── App.tsx                 # Root + Router
└── main.tsx                # Entry point
```

---

## 🧩 Stack y decisiones técnicas

| Pieza | Tecnología | Por qué |
|------|-----------|---------|
| **Framework** | React 18 + TypeScript | Estándar de la industria, tipado completo |
| **Build** | Vite 5 | Build instantáneo, HMR ultrarrápido |
| **State management** | Redux Toolkit | Estado complejo (cola + player + room + user) |
| **Routing** | React Router v6 | Múltiples vistas con animaciones entre rutas |
| **Styling** | Tailwind CSS + clsx | Diseño rápido, sin CSS-in-JS pesado |
| **Animations** | Framer Motion | Transiciones declarativas, layout animations |
| **Icons** | Lucide React | Tree-shakeable, consistente |
| **Player** | YouTube IFrame API | Sin almacenar videos, sin licencias |

---

## 🎯 Features implementadas

- ✅ **4 vistas principales** con transiciones animadas (Framer Motion)
- ✅ **Búsqueda con debounce** (300ms) sobre catálogo karaoke
- ✅ **Flujo completo:** usuario → solicita → DJ aprueba → reproduce
- ✅ **YouTube IFrame API** con detección de errores (150/153/101/100)
- ✅ **Auto-skip** a la siguiente canción si una falla embed
- ✅ **Sistema de votos** con re-ordenamiento automático
- ✅ **Overlays personalizados** sobre el video (logo, QR, "cantando ahora")
- ✅ **Toast notifications** con Framer Motion
- ✅ **Responsive design** mobile-first
- ✅ **Tipado TypeScript estricto** en toda la app

---

## 🔌 Próximos pasos (producción)

1. **Backend en Supabase**
   - Esquema multi-venue con `venues`, `rooms`, `requests`, `votes`
   - Realtime channels por sala (`room:${id}`)
   - Auth con Magic Links para los DJs
2. **YouTube Data API v3**
   - Sustituir `services/catalog.ts` con búsqueda real
   - Filtrar resultados con `status.embeddable === true`
3. **Generador de QR**
   - Lib: `qrcode.js` o servicio externo
   - PDF imprimible con un QR por mesa
4. **Multi-plataforma**
   - Spotify Web Playback SDK
   - Vimeo Player API
5. **Deploy**
   - Vercel free tier para frontend
   - Supabase free tier para backend

---

## 🤝 Por JSIT

Construido por **Javier Subiabre** ([JSIT](https://jsit.cl)) — soluciones IT a medida.

Stack low-cost orientado a generar revenue real desde locales nocturnos, eventos privados y celebraciones.

**Costo operativo: $0/mes** hasta 50 salas activas simultáneas. Después se escala por demanda.
