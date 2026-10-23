import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get('title') || 'Production Application';
    const subtitle = searchParams.get('subtitle') || 'High-performance Next.js production platform';
    const tag = searchParams.get('tag') || 'NEXUS';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#0a0a0a',
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #262626 2%, transparent 0%), radial-gradient(circle at 75px 75px, #262626 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '60px 80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-150px',
              right: '-150px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              filter: 'blur(120px)',
            }}
          />

          {/* Top Brand Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#171717',
                  border: '1px solid #262626',
                  color: '#10b981',
                  fontSize: '24px',
                  fontWeight: 700,
                }}
              >
                ▲
              </div>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '-0.5px',
                }}
              >
                {tag}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 18px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                }}
              />
              Live Production
            </div>
          </div>

          {/* Center Main Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              zIndex: 10,
              maxWidth: '1000px',
            }}
          >
            <h1
              style={{
                fontSize: '56px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                letterSpacing: '-1.5px',
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '26px',
                color: '#a3a3a3',
                lineHeight: 1.4,
                margin: 0,
                maxWidth: '900px',
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #262626',
              paddingTop: '24px',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                fontSize: '16px',
                color: '#737373',
                fontFamily: 'monospace',
              }}
            >
              <span>EDGE RUNTIME</span>
              <span>•</span>
              <span>SUB-MILLI LATENCY</span>
              <span>•</span>
              <span>ENTERPRISE GRADE</span>
            </div>
            <div
              style={{
                fontSize: '16px',
                color: '#10b981',
                fontFamily: 'monospace',
                fontWeight: 600,
              }}
            >
              VERIFIED DEPLOYMENT
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to render OpenGraph image: ${e.message}`, { status: 500 });
  }
}
