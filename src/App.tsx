import './App.css'
import {ThemeProvider} from "@/components/theme-provider.tsx";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div>
        <h3 className="text-xl">Sky Speech 2 Text</h3>
      </div>
    </ThemeProvider>
  )
}

export default App
