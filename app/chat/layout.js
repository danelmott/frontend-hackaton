import Sidebar from "@/_components/chat/sidebar/sidebar"
// El JSON de prueba que te pasé
const DATA_PRUEBA = [
    { id: "1", title: "Configuración de Next.js y CSS Modules" },
    { id: "2", title: "Refactorización de AguilarIA" },
    { id: "3", title: "Optimización de consultas SQL en Prisma" },
    { id: "4", title: "Análisis de componentes para Perfumería Cat" },
    { id: "5", title: "Título largo para probar el truncado del texto" }
];

export default function chatLayout({children}) {
    const chatActive = 1
    return (
        <div>
            <Sidebar chats={DATA_PRUEBA} activeChatId={chatActive}/>
            {children}
        </div>
    )
}