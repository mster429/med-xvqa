// src/app/page.tsx
import ImageTool from '../components/ImageTool';
import TabSection from '../components/InteractiveTabs';

export default function Home() {
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#333' }}>
      {/* Left Section */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#222' }}>
        <ImageTool />
      </div>

      {/* Right Section */}
      <div style={{ flex: 1, background: '#444', padding: '20px' }}>
        <TabSection />
      </div>
    </div>
  );
}

