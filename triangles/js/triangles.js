let materials = {};
let triangles = {};
let lights = {};
let scene = undefined;
let camera = undefined;
let renderer = undefined;
let size_x = 15;
let size_y = 15;
let counter = 0;

function make_materials() {
    let materials = {};
    materials.green = new THREE.MeshPhongMaterial( { color: 0xffffff } );
    materials.green.vertexColors = true;

    materials.basic = new THREE.MeshBasicMaterial( );
    materials.basic.vertexColors = true;

    materials.point = new THREE.PointsMaterial( { size: 0.1, vertexColors: true });
    return materials;
}

function make_lights() {
    let lights = {};
    lights.ambient = new THREE.AmbientLight( 0x101010 );
    scene.add(lights.ambient);

    let white = new THREE.DirectionalLight( 0xffffff, 0.8 );
    white.position.x = 0;
    white.position.y = 0;
    white.position.z = 1;
    scene.add( white );
    lights.white = white;

    let yellow = new THREE.DirectionalLight( 0xffff10, 0.5 );
    yellow.position.x = 2;
    yellow.position.y = 5;
    yellow.position.z = -1;
    scene.add( yellow );
    lights.yellow = yellow;

    //let helper = new THREE.DirectionalLightHelper(directionalLight, 4);
    //scene.add(helper);
    return lights;
}

function make_triangle(materials) {
    var geom = new THREE.Geometry();
    var tri = new THREE.Triangle(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-0.5, -Math.sqrt(3)/2, 0),
        new THREE.Vector3(0.5, -Math.sqrt(3)/2, 0)
    );
    geom.vertices.push(tri.a);
    geom.vertices.push(tri.b);
    geom.vertices.push(tri.c);
    //var rgb = [new THREE.Color(0xff0000), new THREE.Color(0x00ff00), new THREE.Color(0x0000ff)];
    var normal = new THREE.Vector3();
    tri.getNormal(normal);
    geom.faces.push(new THREE.Face3(0, 1, 2, normal));
    geom.faces.push(new THREE.Face3(0, 2, 1, normal/*.negate()*/));
    //geom.faces[0].vertexColors = rgb;
    //geom.faces[1].vertexColors = rgb;
    
    var triMesh = new THREE.Mesh(geom, materials.green /*basic*/);

    return triMesh;
}

function resize() {
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function setup() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    document.body.appendChild( renderer.domElement );

    resize();
    window.addEventListener('resize', resize);

    materials = make_materials();
    lights = make_lights();

    for (var x = -size_x; x <= size_x; x++) {
        for (var y = -size_y; y <= size_y; y++) {
            let triangle = make_triangle(materials);
            triangle.scale.x = 0.7;
            triangle.scale.y = 0.7;
            triangle.scale.z = 0.7;
            triangle.position.x = x;
            triangle.position.y = y;
            //triangle.rotation.y = x / 36 + y / 36;
            scene.add(triangle);
            let key = "" + x + "x" + y; //`${x}x${y}`;
            triangles[key] = triangle;
        }
    }


    function animate() {
        requestAnimationFrame( animate );
        counter++;
        camera.position.z = 11 + 1.5 * Math.sin(counter/36);
        camera.position.x = 2 * Math.sin(counter/36);
        camera.position.y = 1 * Math.cos(counter/17);
        camera.rotation.z += 0.01;

        yellow = lights.yellow;
        yellow.position.x = 2 + 8 * Math.sin(counter / 60);
        yellow.position.y = 5 + 6 * Math.cos(counter / 60);
        yellow.position.z = -1 + 7 * Math.sin(counter / 60);

        renderer.render( scene, camera );
    
        for (var x = -size_x; x <= size_x; x++) {
            for (var y = -size_y; y <= size_y; y++) {
            	let key = "" + x + "x" + y;
                //let key = `${x}x${y}`;
                let triangle = triangles[key];
                triangle.rotation.z += 0.05;
                triangle.rotation.y += x / 50;
                triangle.rotation.x += y / 50;
            }
        }
    }

    animate();
}

setup();

