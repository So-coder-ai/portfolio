
document.addEventListener('DOMContentLoaded', function() {
    
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded');
        return;
    }
    
    const canvas = document.getElementById('bg-canvas');
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    if (isDarkMode) {
        scene.background = new THREE.Color(0x0f172a);
    } else {
        scene.background = new THREE.Color(0xffffff);
    }
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);
    
    const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: isDarkMode ? 0x6d28d9 : 0x8b5cf6,
        wireframe: true,
        metalness: 0.5,
        roughness: 0.5
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -5;
    scene.add(plane);
    
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 500;
    
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: isDarkMode ? 0xa78bfa : 0x7c3aed,
        transparent: true
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    let stars;
    if (isDarkMode) {
        const starsGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount * 3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 100;
        }
        
        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        
        const starsMaterial = new THREE.PointsMaterial({
            size: 0.1,
            color: 0xffffff
        });
        
        stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);
    }
    
    camera.position.z = 15;
    
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        const isDarkMode = document.body.classList.contains('dark-mode');
       
        if (isDarkMode) {
            scene.background = new THREE.Color(0x0f172a);
            
            if (!stars) {
                const starsGeometry = new THREE.BufferGeometry();
                const starCount = 1000;
                
                const starPositions = new Float32Array(starCount * 3);
                for (let i = 0; i < starCount * 3; i++) {
                    starPositions[i] = (Math.random() - 0.5) * 100;
                }
                
                starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
                
                const starsMaterial = new THREE.PointsMaterial({
                    size: 0.1,
                    color: 0xffffff
                });
                
                stars = new THREE.Points(starsGeometry, starsMaterial);
                scene.add(stars);
            }
        } else {
            scene.background = new THREE.Color(0xffffff);
            
            if (stars) {
                scene.remove(stars);
                stars = null;
            }
        }
        
     
        planeMaterial.color.set(isDarkMode ? 0x6d28d9 : 0x8b5cf6);
        particlesMaterial.color.set(isDarkMode ? 0xa78bfa : 0x7c3aed);
    });
    
   
    function animate() {
        requestAnimationFrame(animate);
    
        const time = Date.now() * 0.001;
        
       
        const positions = planeGeometry.attributes.position;
        
        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);
            
         
            const waveX1 = 0.5 * Math.sin(x * 0.5 + time);
            const waveX2 = 0.25 * Math.sin(x * 1 + time * 0.8);
            const waveY1 = 0.5 * Math.sin(y * 0.5 + time * 1.2);
            const waveY2 = 0.25 * Math.sin(y * 1 + time);
            
            positions.setZ(i, waveX1 + waveX2 + waveY1 + waveY2);
        }
        
        positions.needsUpdate = true;
       
        particlesMesh.rotation.y = time * 0.05;
        particlesMesh.rotation.x = Math.sin(time * 0.025) * 0.1;
        
      
        if (stars) {
            stars.rotation.y = time * 0.02;
        }
        
        renderer.render(scene, camera);
    }
    
   
    animate();
});