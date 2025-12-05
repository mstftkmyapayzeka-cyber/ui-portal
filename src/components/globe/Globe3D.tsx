'use client'

import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'

// Region data
const regions = [
  { id: 'europe', name: 'Avrupa', lat: 50, lng: 10, color: '#3B82F6' },
  { id: 'middle-east', name: 'Orta Doğu', lat: 25, lng: 45, color: '#F59E0B' },
  { id: 'asia-pacific', name: 'Asya-Pasifik', lat: 30, lng: 105, color: '#EC4899' },
  { id: 'north-america', name: 'Kuzey Amerika', lat: 45, lng: -100, color: '#06B6D4' },
  { id: 'south-america', name: 'Güney Amerika', lat: -15, lng: -60, color: '#22C55E' },
  { id: 'africa', name: 'Afrika', lat: 0, lng: 20, color: '#EAB308' },
  { id: 'turkey', name: 'Türkiye', lat: 39, lng: 35, color: '#EF4444' },
]

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

interface Globe3DProps {
  onRegionSelect?: (regionName: string) => void
  className?: string
}

export default function Globe3D({ onRegionSelect, className = '' }: Globe3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 5

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5)
    sunLight.position.set(5, 3, 5)
    scene.add(sunLight)

    // Texture loader
    const textureLoader = new THREE.TextureLoader()

    // Load Earth textures from NASA/free sources
    const earthTexture = textureLoader.load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg',
      () => setLoading(false)
    )
    
    const bumpTexture = textureLoader.load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png'
    )

    const cloudsTexture = textureLoader.load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-clouds.png'
    )

    // Earth
    const earthGeometry = new THREE.SphereGeometry(2, 64, 64)
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.05,
      roughness: 0.7,
      metalness: 0.0,
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    scene.add(earth)

    // Clouds layer
    const cloudsGeometry = new THREE.SphereGeometry(2.02, 64, 64)
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    })
    const clouds = new THREE.Mesh(cloudsGeometry, cloudsMaterial)
    scene.add(clouds)

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(2.15, 64, 64)
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    // Stars
    const starsGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(6000)
    for (let i = 0; i < 6000; i += 3) {
      const r = 100 + Math.random() * 100
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPositions[i] = r * Math.sin(phi) * Math.cos(theta)
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta)
      starPositions[i + 2] = r * Math.cos(phi)
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starsMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: 0.5,
      transparent: true,
      opacity: 0.8
    })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // Region markers
    const markers: THREE.Mesh[] = []
    const markerGroup = new THREE.Group()
    
    regions.forEach((region) => {
      const position = latLngToVector3(region.lat, region.lng, 2.05)
      
      // Outer glow
      const glowGeometry = new THREE.SphereGeometry(0.08, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: region.color,
        transparent: true,
        opacity: 0.3,
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      glow.position.copy(position)
      markerGroup.add(glow)

      // Inner marker
      const markerGeometry = new THREE.SphereGeometry(0.04, 16, 16)
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: region.color,
      })
      const marker = new THREE.Mesh(markerGeometry, markerMaterial)
      marker.position.copy(position)
      marker.userData = { region, glow }
      markerGroup.add(marker)
      markers.push(marker)

      // Pulse ring
      const ringGeometry = new THREE.RingGeometry(0.06, 0.1, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: region.color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.position.copy(position)
      ring.lookAt(0, 0, 0)
      ring.userData = { baseScale: 1 }
      markerGroup.add(ring)
    })
    
    scene.add(markerGroup)

    // Mouse interaction state
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }
    let autoRotate = true
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      autoRotate = false
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging = false
      setTimeout(() => { autoRotate = true }, 2000)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(markers)

      if (intersects.length > 0) {
        const region = intersects[0].object.userData.region
        setHoveredRegion(region.name)
        container.style.cursor = 'pointer'
        
        // Highlight
        markers.forEach((m) => {
          const glow = m.userData.glow as THREE.Mesh
          const mat = glow.material as THREE.MeshBasicMaterial
          mat.opacity = m === intersects[0].object ? 0.8 : 0.3
        })
      } else {
        setHoveredRegion(null)
        container.style.cursor = isDragging ? 'grabbing' : 'grab'
        markers.forEach((m) => {
          const glow = m.userData.glow as THREE.Mesh
          const mat = glow.material as THREE.MeshBasicMaterial
          mat.opacity = 0.3
        })
      }

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x
        const deltaY = e.clientY - previousMousePosition.y
        
        earth.rotation.y += deltaX * 0.005
        clouds.rotation.y += deltaX * 0.005
        markerGroup.rotation.y += deltaX * 0.005
        
        // Limit vertical rotation
        const newRotX = earth.rotation.x + deltaY * 0.005
        if (newRotX > -1 && newRotX < 1) {
          earth.rotation.x = newRotX
          clouds.rotation.x = newRotX
          markerGroup.rotation.x = newRotX
        }
        
        previousMousePosition = { x: e.clientX, y: e.clientY }
      }
    }

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(markers)

      if (intersects.length > 0 && onRegionSelect) {
        const region = intersects[0].object.userData.region
        onRegionSelect(region.name)
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      camera.position.z += e.deltaY * 0.005
      camera.position.z = Math.max(3, Math.min(10, camera.position.z))
    }

    container.addEventListener('mousedown', onMouseDown)
    container.addEventListener('mouseup', onMouseUp)
    container.addEventListener('mouseleave', onMouseUp)
    container.addEventListener('mousemove', onMouseMove)
    container.addEventListener('click', onClick)
    container.addEventListener('wheel', onWheel, { passive: false })

    // Animation
    let animationId: number
    let time = 0

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      time += 0.016

      // Auto rotation
      if (autoRotate) {
        earth.rotation.y += 0.001
        clouds.rotation.y += 0.0012
        markerGroup.rotation.y += 0.001
      }

      // Pulse markers
      markerGroup.children.forEach((child, i) => {
        if (child.userData.baseScale !== undefined) {
          const scale = 1 + Math.sin(time * 2 + i * 0.5) * 0.3
          child.scale.setScalar(scale)
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      container.removeEventListener('mousedown', onMouseDown)
      container.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('mouseleave', onMouseUp)
      container.removeEventListener('mousemove', onMouseMove)
      container.removeEventListener('click', onClick)
      container.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [mounted, onRegionSelect])

  if (!mounted) {
    return (
      <div className={`bg-black flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="w-full h-full" style={{ cursor: 'grab' }} />
      
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Dünya yükleniyor...</p>
            <p className="text-slate-400 text-sm mt-2">NASA görüntüleri indiriliyor</p>
          </div>
        </div>
      )}
      
      {/* Hovered region tooltip */}
      {hoveredRegion && !loading && (
        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-3 rounded-xl shadow-xl border border-white/10 z-20">
          <p className="font-bold text-lg">{hoveredRegion}</p>
          <p className="text-xs text-teal-400">Tıkla → Haberleri gör</p>
        </div>
      )}

      {/* Instructions */}
      {!loading && (
        <div className="absolute bottom-4 left-4 text-xs text-white/60 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 z-20">
          <p>🖱️ Sürükle: Döndür</p>
          <p>🔍 Scroll: Yakınlaştır</p>
          <p>📍 Noktalara tıkla: Bölge seç</p>
        </div>
      )}
    </div>
  )
}
