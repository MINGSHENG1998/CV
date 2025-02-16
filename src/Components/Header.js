import React, { Component, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";

const SpaceBackground = ({
  starCount = 15000,
  autoRotate = true,
  starDensity = 1,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const autoRotationSpeed = useRef(0.0001);

  // Enhanced color palette for a more vibrant space
  const starColors = useMemo(
    () => [
      new THREE.Color(0xffffff), // White
      new THREE.Color(0xfff4e8), // Warm White
      new THREE.Color(0xe8f4ff), // Cool White
      new THREE.Color(0xffe4b5), // Light Orange
      new THREE.Color(0xb5e8ff), // Light Blue
      new THREE.Color(0xffd700), // Gold
      new THREE.Color(0xff8c00), // Dark Orange
      new THREE.Color(0x00bfff), // Deep Sky Blue
      new THREE.Color(0xff69b4), // Hot Pink (for young stars)
      new THREE.Color(0xff4500), // Red Orange (for red giants)
      new THREE.Color(0x7df9ff), // Electric Blue
      new THREE.Color(0x90ee90), // Light Green (for unusual stars)
    ],
    []
  );

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0003); // Add fog for depth

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    renderer.physicallyCorrectLights = true;
    renderer.setClearColor(0x000000, 1);

    const updateSize = () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    // Create spiral galaxy arms
    const createSpiralGalaxy = (centerX, centerY, centerZ, scale = 1) => {
      const galaxyGeometry = new THREE.BufferGeometry();
      const galaxyParticles = 5000;
      const positions = [];
      const colors = [];
      const sizes = [];

      const galaxyColors = [
        new THREE.Color(0xff69b4).multiplyScalar(0.4), // Pink
        new THREE.Color(0x4169e1).multiplyScalar(0.4), // Royal Blue
        new THREE.Color(0x9370db).multiplyScalar(0.4), // Medium Purple
        new THREE.Color(0x20b2aa).multiplyScalar(0.4), // Light Sea Green
      ];

      for (let i = 0; i < galaxyParticles; i++) {
        // Spiral pattern
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 200 * scale;
        const spiralOffset = (radius / (200 * scale)) * Math.PI * 4;
        const finalAngle = angle + spiralOffset;

        positions.push(
          centerX + Math.cos(finalAngle) * radius,
          centerY + (Math.random() - 0.5) * 20 * scale,
          centerZ + Math.sin(finalAngle) * radius
        );

        const color =
          galaxyColors[Math.floor(Math.random() * galaxyColors.length)];
        colors.push(color.r, color.g, color.b);
        sizes.push(Math.random() * 4 + 1);
      }

      galaxyGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      galaxyGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );
      galaxyGeometry.setAttribute(
        "size",
        new THREE.Float32BufferAttribute(sizes, 1)
      );

      const galaxyMaterial = new THREE.PointsMaterial({
        size: 1,
        transparent: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        opacity: 0.6,
        sizeAttenuation: true,
      });

      return new THREE.Points(galaxyGeometry, galaxyMaterial);
    };

    // Create colorful nebula clouds
    const createNebula = (centerX, centerY, centerZ, scale = 1) => {
      const nebulaGeometry = new THREE.BufferGeometry();
      const nebulaParticles = 2000;
      const positions = [];
      const colors = [];
      const sizes = [];

      const nebulaColors = [
        new THREE.Color(0xff1493).multiplyScalar(0.3), // Deep Pink
        new THREE.Color(0x4b0082).multiplyScalar(0.3), // Indigo
        new THREE.Color(0x9400d3).multiplyScalar(0.3), // Dark Violet
        new THREE.Color(0x00ced1).multiplyScalar(0.3), // Dark Turquoise
      ];

      for (let i = 0; i < nebulaParticles; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = (50 + Math.random() * 100) * scale;

        positions.push(
          centerX + radius * Math.sin(phi) * Math.cos(theta),
          centerY + radius * Math.sin(phi) * Math.sin(theta),
          centerZ + radius * Math.cos(phi)
        );

        const color =
          nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
        colors.push(color.r, color.g, color.b);
        sizes.push(Math.random() * 15 + 5);
      }

      nebulaGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      nebulaGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );
      nebulaGeometry.setAttribute(
        "size",
        new THREE.Float32BufferAttribute(sizes, 1)
      );

      const nebulaMaterial = new THREE.PointsMaterial({
        size: 1,
        transparent: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        opacity: 0.4,
        sizeAttenuation: true,
      });

      return new THREE.Points(nebulaGeometry, nebulaMaterial);
    };

    // Create background stars
    const createStars = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];
      const sizes = [];

      for (let i = 0; i < starCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = Math.pow(Math.random(), starDensity) * 1000;

        positions.push(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        );

        const color = starColors[Math.floor(Math.random() * starColors.length)];
        colors.push(color.r, color.g, color.b);

        const size =
          Math.random() < 0.1
            ? Math.random() * 4 + 2
            : Math.random() * 1.5 + 0.5;
        sizes.push(size);
      }

      starsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      starsGeometry.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colors, 3)
      );
      starsGeometry.setAttribute(
        "size",
        new THREE.Float32BufferAttribute(sizes, 1)
      );

      const starsMaterial = new THREE.PointsMaterial({
        size: 1,
        transparent: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        sizeAttenuation: true,
      });

      return new THREE.Points(starsGeometry, starsMaterial);
    };

    // Create all space objects
    const stars = createStars();

    // Create multiple galaxies at different positions
    const galaxy1 = createSpiralGalaxy(300, -100, -400, 1.5);
    const galaxy2 = createSpiralGalaxy(-400, 200, -300, 1);
    const galaxy3 = createSpiralGalaxy(0, -200, -500, 2);

    // Create multiple nebulae
    const nebula1 = createNebula(200, 100, -200, 2);
    const nebula2 = createNebula(-300, -150, -350, 1.5);
    const nebula3 = createNebula(100, 300, -400, 2.5);

    // Add everything to the scene
    scene.add(stars);
    scene.add(galaxy1);
    scene.add(galaxy2);
    scene.add(galaxy3);
    scene.add(nebula1);
    scene.add(nebula2);
    scene.add(nebula3);

    camera.position.z = 500;

    let velocity = { x: 0, y: 0 };
    const friction = 0.95;

    const handleMouseDown = (e) => {
      isDragging.current = true;
      previousMousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
      velocity = { x: 0, y: 0 };
    };

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;

      const deltaMove = {
        x: e.clientX - previousMousePosition.current.x,
        y: e.clientY - previousMousePosition.current.y,
      };

      velocity = {
        x: deltaMove.x * 0.002,
        y: deltaMove.y * 0.002,
      };

      // Rotate all objects
      [stars, galaxy1, galaxy2, galaxy3, nebula1, nebula2, nebula3].forEach(
        (obj) => {
          obj.rotation.y += velocity.x;
          obj.rotation.x += velocity.y;
        }
      );

      previousMousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMouseDown({ clientX: touch.clientX, clientY: touch.clientY });
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      handleMouseUp();
    };

    const animate = () => {
      requestAnimationFrame(animate);

      if (!isDragging.current && autoRotate) {
        // Different rotation speeds for different objects
        stars.rotation.y += autoRotationSpeed.current;
        galaxy1.rotation.y += autoRotationSpeed.current * 0.8;
        galaxy2.rotation.y += autoRotationSpeed.current * 1.2;
        galaxy3.rotation.y += autoRotationSpeed.current * 0.6;
        nebula1.rotation.y += autoRotationSpeed.current * 0.5;
        nebula2.rotation.y += autoRotationSpeed.current * 0.7;
        nebula3.rotation.y += autoRotationSpeed.current * 0.9;
      }

      if (
        !isDragging.current &&
        (Math.abs(velocity.x) > 0.001 || Math.abs(velocity.y) > 0.001)
      ) {
        [stars, galaxy1, galaxy2, galaxy3, nebula1, nebula2, nebula3].forEach(
          (obj) => {
            obj.rotation.y += velocity.x;
            obj.rotation.x += velocity.y;
          }
        );
        velocity.x *= friction;
        velocity.y *= friction;
      }

      renderer.render(scene, camera);
    };

    updateSize();

    mountRef.current.appendChild(renderer.domElement);
    window.addEventListener("resize", updateSize);
    mountRef.current.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    mountRef.current.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    mountRef.current.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    mountRef.current.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });

    animate();
    sceneRef.current = { scene, camera, renderer };

    return () => {
      window.removeEventListener("resize", updateSize);
      mountRef.current.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      mountRef.current.removeEventListener("touchstart", handleTouchStart);
      mountRef.current.removeEventListener("touchmove", handleTouchMove);
      mountRef.current.removeEventListener("touchend", handleTouchEnd);
      mountRef.current.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, [starCount, autoRotate, starDensity, starColors]);

  return (
    <div
      ref={mountRef}
      className="space-background"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        cursor: "grab",
        "&:active": {
          cursor: "grabbing",
        },
      }}
    />
  );
};
class Header extends Component {
  render() {
    if (this.props.data) {
      var name = this.props.data.name;
      var occupation = this.props.data.occupation;
      var description = this.props.data.description;
      var networks = this.props.data.social.map(function (network) {
        return (
          <li key={network.name}>
            <a href={network.url}>
              <i className={network.className}></i>
            </a>
          </li>
        );
      });
    }

    return (
      <header id="home">
        <nav id="nav-wrap">
          <a className="mobile-btn" href="#nav-wrap" title="Show navigation">
            Show navigation
          </a>
          <a className="mobile-btn" href="#home" title="Hide navigation">
            Hide navigation
          </a>

          <ul id="nav" className="nav">
            <li className="current">
              <a className="smoothscroll" href="#home">
                Home
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#about">
                About
              </a>
            </li>
            <li>
              <a className="smoothscroll" href="#resume">
                Resume
              </a>
            </li>
            {/* <li><a className="smoothscroll" href="#portfolio">Works</a></li>
            <li><a className="smoothscroll" href="#contact">Contact</a></li> */}
          </ul>
        </nav>
        <SpaceBackground
          starCount={10000}
          autoRotate={true}
          starDensity={0.5}
        />
        <div className="row banner">
          <div className="banner-text">
            <h1 className="responsive-headline">
              {name ? "I'm " + name : "Welcome"}
            </h1>
            <h3>
              {occupation ? "Innovative" : null} <span>{occupation}</span>{" "}
              {description}.
            </h3>
            <ul className="social">{networks}</ul>
          </div>
        </div>

        <p className="scrolldown">
          <a className="smoothscroll" href="#about">
            <i className="icon-down-circle"></i>
          </a>
        </p>
      </header>
    );
  }
}

export default Header;
