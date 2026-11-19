import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

interface HeroSystemsCanvasProps {
  isDark: boolean;
}

interface MeshNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  isHub: boolean;
  radius: number;
  pulse: number;
  phase: number;
}

interface DataPacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  trail: { x: number; y: number }[];
}

interface HubRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface ScaleBar {
  xRatio: number;
  baseHeight: number;
  amplitude: number;
  phase: number;
  speed: number;
  width: number;
}

export function HeroSystemsCanvas({ isDark }: HeroSystemsCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isDarkRef = useRef(isDark);
  const drawStaticRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    isDarkRef.current = isDark;
    if (prefersReducedMotion && drawStaticRef.current) {
      drawStaticRef.current();
    }
  }, [isDark, prefersReducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animationId = 0;
    let isVisible = true;
    let time = 0;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
      smoothX: 0,
      smoothY: 0,
      normX: 0,
      normY: 0,
      smoothNormX: 0,
      smoothNormY: 0,
      presence: 0,
      vx: 0,
      vy: 0,
    };

    let nodes: MeshNode[] = [];
    let packets: DataPacket[] = [];
    let rings: HubRing[] = [];
    let scaleBars: ScaleBar[] = [];

    const createScene = (w: number, h: number) => {
      const count = w < 640 ? 32 : w < 1024 ? 46 : 64;
      nodes = [];
      packets = [];
      rings = [];

      for (let i = 0; i < count; i++) {
        // Balanced distribution across the entire hero with slightly richer flanks
        let nx = Math.random();
        if (i % 2 === 0) {
          nx = Math.random() < 0.5 ? Math.random() * 0.4 : 0.6 + Math.random() * 0.4;
        }
        const ny = 0.06 + Math.random() * 0.88;
        const x = nx * w;
        const y = ny * h;
        const isHub = i % 5 === 0;

        nodes.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.36,
          vy: (Math.random() - 0.5) * 0.3,
          isHub,
          radius: isHub ? 4.4 : 2.3,
          pulse: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
        });
      }

      // Subtle ascending scalability bars along left and right lower flanks
      scaleBars = [];
      const barCountPerSide = w < 768 ? 5 : 9;
      for (let i = 0; i < barCountPerSide; i++) {
        scaleBars.push({
          xRatio: 0.03 + i * 0.022,
          baseHeight: 30 + i * 11,
          amplitude: 16 + (i % 3) * 8,
          phase: i * 0.65,
          speed: 0.02 + (i % 4) * 0.004,
          width: 4,
        });
        scaleBars.push({
          xRatio: 0.97 - i * 0.022,
          baseHeight: 30 + i * 11,
          amplitude: 16 + (i % 3) * 8,
          phase: i * 0.65 + 1.4,
          speed: 0.02 + (i % 4) * 0.004,
          width: 4,
        });
      }
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!pointer.active) {
        pointer.x = width * 0.5;
        pointer.y = height * 0.45;
        pointer.smoothX = width * 0.5;
        pointer.smoothY = height * 0.45;
      }
      createScene(width, height);
    };

    const spawnPacket = (maxDist: number) => {
      if (nodes.length < 2 || packets.length > 30) return;
      const fromIdx = Math.floor(Math.random() * nodes.length);
      const fromNode = nodes[fromIdx];

      const candidates: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j === fromIdx) continue;
        const dx = nodes[j].x - fromNode.x;
        const dy = nodes[j].y - fromNode.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDist && dist > 30) {
          candidates.push(j);
        }
      }

      if (candidates.length === 0) return;
      const toIdx = candidates[Math.floor(Math.random() * candidates.length)];
      packets.push({
        fromIdx,
        toIdx,
        progress: 0,
        speed: 0.012 + Math.random() * 0.013,
        trail: [],
      });
    };

    const drawFrame = (animate: boolean) => {
      const dark = isDarkRef.current;
      const maxLinkDist = width < 640 ? 155 : 220;

      ctx.clearRect(0, 0, width, height);

      // Smooth pointer tracking & parallax interpolation
      const prevSmoothX = pointer.smoothX;
      const prevSmoothY = pointer.smoothY;
      if (pointer.active) {
        pointer.presence += (1 - pointer.presence) * 0.1;
        pointer.smoothX += (pointer.x - pointer.smoothX) * 0.14;
        pointer.smoothY += (pointer.y - pointer.smoothY) * 0.14;
        pointer.smoothNormX += (pointer.normX - pointer.smoothNormX) * 0.08;
        pointer.smoothNormY += (pointer.normY - pointer.smoothNormY) * 0.08;
      } else {
        pointer.presence += (0 - pointer.presence) * 0.06;
        pointer.smoothNormX += (0 - pointer.smoothNormX) * 0.04;
        pointer.smoothNormY += (0 - pointer.smoothNormY) * 0.04;
      }
      pointer.vx = pointer.smoothX - prevSmoothX;
      pointer.vy = pointer.smoothY - prevSmoothY;

      const parallaxOffsetX = pointer.smoothNormX * 28;
      const parallaxOffsetY = pointer.smoothNormY * 20;

      // Palette adapted for Dark (#0B0F1D + #F36319) vs Light (#FFFFFF + #06285A / #0284C7 / #F36319)
      const accent = '243, 99, 25';
      const lightAccent = dark ? '243, 99, 25' : '2, 132, 199';
      const secondary = dark ? '148, 163, 184' : '6, 40, 90';
      const gridColor = dark ? 'rgba(255, 255, 255, 0.048)' : 'rgba(6, 40, 90, 0.055)';
      const horizonGlowColor = dark
        ? 'rgba(243, 99, 25, 0.1)'
        : 'rgba(2, 132, 199, 0.075)';

      // 1. Ambient horizon glow that shifts gently with the mouse + direct cursor spotlight
      const horizonY = height * 0.72 + parallaxOffsetY * 0.35;
      const glowCenterX = width * 0.5 + parallaxOffsetX * 1.4;
      const glowCenterY = height * 0.42 + parallaxOffsetY * 1.4;

      const glowGrad = ctx.createRadialGradient(
        glowCenterX,
        glowCenterY,
        20,
        glowCenterX,
        glowCenterY,
        Math.max(width, height) * 0.65
      );
      glowGrad.addColorStop(0, horizonGlowColor);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      if (pointer.presence > 0.01) {
        const cursorGlowRadius = width < 640 ? 220 : 340;
        const cursorGrad = ctx.createRadialGradient(
          pointer.smoothX,
          pointer.smoothY,
          0,
          pointer.smoothX,
          pointer.smoothY,
          cursorGlowRadius
        );
        cursorGrad.addColorStop(
          0,
          `rgba(${lightAccent}, ${(dark ? 0.2 : 0.14) * pointer.presence})`
        );
        cursorGrad.addColorStop(
          0.45,
          `rgba(${accent}, ${(dark ? 0.075 : 0.055) * pointer.presence})`
        );
        cursorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = cursorGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 1b. Living architectural grid that drifts smoothly and flexes/follows the mouse
      const step = 64;
      const ambientDriftX = animate ? Math.sin(time * 0.45) * 10 : 0;
      const ambientDriftY = animate ? Math.cos(time * 0.35) * 8 : 0;
      const cols = Math.ceil(width / step) + 3;
      const rows = Math.ceil(height / step) + 3;
      const startX = -step + ((parallaxOffsetX * 0.75 + ambientDriftX) % step);
      const startY = -step + ((parallaxOffsetY * 0.75 + ambientDriftY) % step);

      const gridPts: { x: number; y: number; boost: number }[][] = [];
      const warpRadius = 260;

      for (let r = 0; r < rows; r++) {
        const rowPts: { x: number; y: number; boost: number }[] = [];
        const baseGy = startY + r * step;
        for (let c = 0; c < cols; c++) {
          let gx = startX + c * step;
          let gy = baseGy;
          let boost = 0;

          if (animate) {
            gx += Math.sin(time * 0.9 + r * 0.45) * 2.2;
            gy += Math.cos(time * 0.8 + c * 0.4) * 2.2;
          }

          if (pointer.presence > 0.01) {
            const dx = pointer.smoothX - gx;
            const dy = pointer.smoothY - gy;
            const dist = Math.hypot(dx, dy);
            if (dist < warpRadius && dist > 0.001) {
              const t = 1 - dist / warpRadius;
              const pull = t * t * 22 * pointer.presence;
              gx += (dx / dist) * pull;
              gy += (dy / dist) * pull;
              boost = t * pointer.presence;
            }
          }

          rowPts.push({ x: gx, y: gy, boost });
        }
        gridPts.push(rowPts);
      }

      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const p1 = gridPts[r][c];
          const p2 = gridPts[r][c + 1];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 1; r++) {
          const p1 = gridPts[r][c];
          const p2 = gridPts[r + 1][c];
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      }
      ctx.stroke();

      // Highlighted grid lattice & intersections around the cursor
      if (pointer.presence > 0.02) {
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = gridPts[r][c];
            if (p.boost > 0.08) {
              if (c < cols - 1) {
                const pr = gridPts[r][c + 1];
                const segBoost = Math.max(p.boost, pr.boost);
                ctx.strokeStyle = `rgba(${lightAccent}, ${segBoost * (dark ? 0.24 : 0.2)})`;
                ctx.lineWidth = 1.05;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(pr.x, pr.y);
                ctx.stroke();
              }
              if (r < rows - 1) {
                const pd = gridPts[r + 1][c];
                const segBoost = Math.max(p.boost, pd.boost);
                ctx.strokeStyle = `rgba(${lightAccent}, ${segBoost * (dark ? 0.24 : 0.2)})`;
                ctx.lineWidth = 1.05;
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(pd.x, pd.y);
                ctx.stroke();
              }

              ctx.fillStyle = `rgba(${accent}, ${p.boost * (dark ? 0.65 : 0.5)})`;
              ctx.beginPath();
              ctx.arc(p.x, p.y, 1.4 + p.boost * 1.3, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // Subtle moving horizontal scanline sweep (top-to-bottom architectural telemetry feel)
      if (animate) {
        const sweepY = ((time * 32) % (height + 160)) - 80;
        const sweepGrad = ctx.createLinearGradient(0, sweepY - 60, 0, sweepY + 60);
        sweepGrad.addColorStop(0, 'rgba(243, 99, 25, 0)');
        sweepGrad.addColorStop(
          0.5,
          dark ? 'rgba(243, 99, 25, 0.065)' : 'rgba(2, 132, 199, 0.055)'
        );
        sweepGrad.addColorStop(1, 'rgba(243, 99, 25, 0)');
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, sweepY - 60, width, 120);
      }

      // 2. Scalability bars on left & right lower flanks (react subtly to mouse proximity)
      for (const bar of scaleBars) {
        const bx = bar.xRatio * width + parallaxOffsetX * 0.4;
        const oscillation = animate
          ? Math.sin(time * bar.speed * 60 + bar.phase) * bar.amplitude
          : 0;
        let pointerBoost = 0;
        if (pointer.presence > 0.01) {
          const distX = Math.abs(pointer.smoothX - bx);
          if (distX < 220) {
            pointerBoost = (1 - distX / 220) * 34 * pointer.presence;
          }
        }
        const bh = Math.max(12, bar.baseHeight + oscillation + pointerBoost);
        const by = height - bh;

        const barGrad = ctx.createLinearGradient(bx, by, bx, height);
        barGrad.addColorStop(0, `rgba(${accent}, ${dark ? 0.28 : 0.18})`);
        barGrad.addColorStop(1, `rgba(${accent}, 0)`);

        ctx.fillStyle = barGrad;
        ctx.fillRect(bx - bar.width / 2, by, bar.width, bh);

        ctx.fillStyle = `rgba(${accent}, ${dark ? 0.62 : 0.45})`;
        ctx.fillRect(bx - bar.width / 2, by, bar.width, 2);
      }

      // 3. Update node positions (ambient orbital drift + strong magnetic follow with cursor)
      if (animate) {
        const attractRadius = width < 640 ? 220 : 300;
        for (const node of nodes) {
          node.pulse += 0.032;

          // Parallax-shifted home anchor so the entire constellation glides along with the mouse
          const targetHomeX =
            node.baseX +
            parallaxOffsetX * (node.isHub ? 1.15 : 0.75) +
            Math.sin(time * 0.7 + node.phase) * 14;
          const targetHomeY =
            node.baseY +
            parallaxOffsetY * (node.isHub ? 1.15 : 0.75) +
            Math.cos(time * 0.6 + node.phase) * 12;

          // Spring gently toward drifting home anchor
          node.vx += (targetHomeX - node.x) * 0.0022;
          node.vy += (targetHomeY - node.y) * 0.0022;

          // Magnetic follow: nodes within radius pull toward the mouse and travel along with it
          if (pointer.presence > 0.01) {
            const dx = pointer.smoothX - node.x;
            const dy = pointer.smoothY - node.y;
            const dist = Math.hypot(dx, dy);
            if (dist < attractRadius && dist > 1) {
              const closeness = 1 - dist / attractRadius;
              // Keep a clean orbital buffer (~46px) so nodes glide around the cursor instead of collapsing into one point
              if (dist > 46) {
                const pullForce = closeness * closeness * 0.34 * pointer.presence;
                node.vx += (dx / dist) * pullForce + pointer.vx * closeness * 0.045;
                node.vy += (dy / dist) * pullForce + pointer.vy * closeness * 0.045;
              } else {
                const cushion = (1 - dist / 46) * 0.22 * pointer.presence;
                node.vx -= (dx / dist) * cushion;
                node.vy -= (dy / dist) * cushion;
              }
            }
          }

          node.x += node.vx;
          node.y += node.vy;

          // Velocity damping for silky inertia
          node.vx *= 0.935;
          node.vy *= 0.935;

          // Soft bounds
          if (node.x < 12) {
            node.x = 12;
            node.vx *= -0.6;
          } else if (node.x > width - 12) {
            node.x = width - 12;
            node.vx *= -0.6;
          }
          if (node.y < 12) {
            node.y = 12;
            node.vy *= -0.6;
          } else if (node.y > height - 12) {
            node.y = height - 12;
            node.vy *= -0.6;
          }
        }
      }

      // 4. Draw mesh connections & magnetic pointer filaments
      const filamentRadius = width < 640 ? 190 : 250;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxLinkDist) {
            const closeness = 1 - dist / maxLinkDist;
            const isHubLink = a.isHub || b.isHub;
            const alpha =
              closeness * (isHubLink ? (dark ? 0.32 : 0.24) : dark ? 0.17 : 0.13);

            ctx.strokeStyle = isHubLink
              ? `rgba(${accent}, ${alpha})`
              : `rgba(${secondary}, ${alpha})`;
            ctx.lineWidth = isHubLink ? 1.2 : 0.9;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Pointer connective filaments that latch onto nearby nodes
        if (pointer.presence > 0.02) {
          const pdx = pointer.smoothX - a.x;
          const pdy = pointer.smoothY - a.y;
          const pdist = Math.hypot(pdx, pdy);
          if (pdist < filamentRadius) {
            const pAlpha =
              (1 - pdist / filamentRadius) * (dark ? 0.52 : 0.42) * pointer.presence;
            ctx.strokeStyle = `rgba(${accent}, ${pAlpha})`;
            ctx.lineWidth = a.isHub ? 1.45 : 1.1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.smoothX, pointer.smoothY);
            ctx.stroke();
          }
        }
      }

      // Precision magnetic focal ring following the pointer
      if (pointer.presence > 0.02) {
        const ringPulse = animate ? Math.sin(time * 3.2) * 2.5 : 0;
        ctx.strokeStyle = `rgba(${accent}, ${(dark ? 0.42 : 0.34) * pointer.presence})`;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.arc(pointer.smoothX, pointer.smoothY, 16 + ringPulse, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(${accent}, ${(dark ? 0.85 : 0.72) * pointer.presence})`;
        ctx.beginPath();
        ctx.arc(pointer.smoothX, pointer.smoothY, 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Update and render flowing data packets
      if (animate) {
        if (Math.random() < 0.25) {
          spawnPacket(maxLinkDist);
        }

        for (let i = packets.length - 1; i >= 0; i--) {
          const pkt = packets[i];
          const from = nodes[pkt.fromIdx];
          const to = nodes[pkt.toIdx];
          if (!from || !to) {
            packets.splice(i, 1);
            continue;
          }

          pkt.progress += pkt.speed;
          const px = from.x + (to.x - from.x) * pkt.progress;
          const py = from.y + (to.y - from.y) * pkt.progress;

          pkt.trail.push({ x: px, y: py });
          if (pkt.trail.length > 9) pkt.trail.shift();

          // Draw packet trail
          if (pkt.trail.length > 1) {
            for (let t = 1; t < pkt.trail.length; t++) {
              const tAlpha = (t / pkt.trail.length) * (dark ? 0.72 : 0.55);
              ctx.strokeStyle = `rgba(${accent}, ${tAlpha})`;
              ctx.lineWidth = 1.85;
              ctx.beginPath();
              ctx.moveTo(pkt.trail[t - 1].x, pkt.trail[t - 1].y);
              ctx.lineTo(pkt.trail[t].x, pkt.trail[t].y);
              ctx.stroke();
            }
          }

          // Draw packet head
          ctx.fillStyle = dark ? '#FF9E66' : '#F36319';
          ctx.beginPath();
          ctx.arc(px, py, 2.4, 0, Math.PI * 2);
          ctx.fill();

          if (pkt.progress >= 1) {
            if (to.isHub) {
              rings.push({
                x: to.x,
                y: to.y,
                radius: 5,
                maxRadius: 28,
                alpha: dark ? 0.68 : 0.48,
              });
            }
            packets.splice(i, 1);
          }
        }

        // Hub arrival rings
        for (let i = rings.length - 1; i >= 0; i--) {
          const ring = rings[i];
          ring.radius += 0.68;
          ring.alpha *= 0.93;
          ctx.strokeStyle = `rgba(${accent}, ${ring.alpha})`;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
          ctx.stroke();

          if (ring.alpha < 0.03 || ring.radius >= ring.maxRadius) {
            rings.splice(i, 1);
          }
        }
      }

      // 6. Draw nodes & modular hub frames
      for (const node of nodes) {
        let proximityGlow = 0;
        if (pointer.presence > 0.01) {
          const d = Math.hypot(pointer.smoothX - node.x, pointer.smoothY - node.y);
          if (d < filamentRadius) {
            proximityGlow = (1 - d / filamentRadius) * pointer.presence;
          }
        }

        if (node.isHub) {
          const pulseScale = (animate ? 1 + Math.sin(node.pulse) * 0.14 : 1) + proximityGlow * 0.25;
          const boxSize = 11.5 * pulseScale;

          // Subtle modular software node frame
          ctx.strokeStyle = `rgba(${accent}, ${(dark ? 0.56 : 0.46) + proximityGlow * 0.32})`;
          ctx.lineWidth = 1.25;
          ctx.strokeRect(
            node.x - boxSize / 2,
            node.y - boxSize / 2,
            boxSize,
            boxSize
          );

          ctx.fillStyle = `rgba(${accent}, ${dark ? 0.95 : 0.88})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2.6 + proximityGlow * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle =
            proximityGlow > 0.2
              ? `rgba(${accent}, ${(dark ? 0.55 : 0.45) + proximityGlow * 0.35})`
              : `rgba(${secondary}, ${dark ? 0.54 : 0.38})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + proximityGlow * 1.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Subtle horizon baseline accent
      const lineGrad = ctx.createLinearGradient(0, horizonY, width, horizonY);
      lineGrad.addColorStop(0, 'rgba(243, 99, 25, 0)');
      lineGrad.addColorStop(0.2, `rgba(${accent}, ${dark ? 0.15 : 0.1})`);
      lineGrad.addColorStop(0.5, `rgba(${accent}, ${dark ? 0.06 : 0.04})`);
      lineGrad.addColorStop(0.8, `rgba(${accent}, ${dark ? 0.15 : 0.1})`);
      lineGrad.addColorStop(1, 'rgba(243, 99, 25, 0)');
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(width, horizonY);
      ctx.stroke();
    };

    const tick = () => {
      if (isVisible) {
        time += 0.016;
        drawFrame(true);
      }
      animationId = window.requestAnimationFrame(tick);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const rx = e.clientX - rect.left;
      const ry = e.clientY - rect.top;
      if (rx >= 0 && rx <= rect.width && ry >= 0 && ry <= rect.height) {
        if (!pointer.active && pointer.presence < 0.05) {
          pointer.smoothX = rx;
          pointer.smoothY = ry;
        }
        pointer.x = rx;
        pointer.y = ry;
        pointer.normX = (rx / Math.max(1, rect.width) - 0.5) * 2;
        pointer.normY = (ry / Math.max(1, rect.height) - 0.5) * 2;
        pointer.active = true;
      } else {
        pointer.active = false;
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    drawStaticRef.current = () => drawFrame(false);
    resize();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (prefersReducedMotion) {
        drawFrame(false);
      }
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    const heroSection = container.parentElement;
    if (!prefersReducedMotion && heroSection) {
      heroSection.addEventListener('pointermove', handlePointerMove, { passive: true });
      heroSection.addEventListener('pointerleave', handlePointerLeave);
    }

    if (prefersReducedMotion) {
      drawFrame(false);
    } else {
      // Seed initial packets so the animation starts alive immediately
      const initDist = width < 640 ? 155 : 220;
      for (let k = 0; k < 12; k++) {
        spawnPacket(initDist);
      }
      animationId = window.requestAnimationFrame(tick);
    }

    return () => {
      drawStaticRef.current = null;
      if (animationId) window.cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (heroSection) {
        heroSection.removeEventListener('pointermove', handlePointerMove);
        heroSection.removeEventListener('pointerleave', handlePointerLeave);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* Balanced readability scrim behind the centered hero typography */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_56%_50%_at_50%_42%,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.24)_58%,transparent_100%)] dark:bg-[radial-gradient(ellipse_56%_50%_at_50%_42%,rgba(11,15,29,0.64)_0%,rgba(11,15,29,0.22)_58%,transparent_100%)]" />
    </div>
  );
}
