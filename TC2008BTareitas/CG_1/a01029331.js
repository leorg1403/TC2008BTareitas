/*
Luis Leonardo Rodriguez A01029331
Tarea 1 - WebGL  - Transformaciones 2D con Pivote Independiente
 */

'use strict';
/* AQUI LE PUSE LIBS EN LUGAR DE LIB Y POR ESO NO LO DETECTABA 
Y TWGL TENIA MAL LA RUTA POR HACER REFERENCIA A UN ARCHIVO QUE NO ESTABA*/
import * as twgl from 'twgl';
import { M3 } from './2d-lib.js';
import GUI from 'lil-gui';


const vsGLSL = `#version 300 es
in vec2 a_position;
in vec4 a_color;

uniform vec2 u_resolution;
uniform mat3 u_transforms;

out vec4 v_color;

void main() {
    vec2 position = (u_transforms * vec3(a_position, 1)).xy;
    vec2 zeroToOne = position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
    v_color = a_color;
}
`;

const fsGLSL = `#version 300 es
precision highp float;

in vec4 v_color;
out vec4 outColor;

void main() {
    outColor = v_color;
}
`;


function buildSmileyGeometry() {
    let arrays = {
        a_position: {
            numComponents: 2,
            data: [
                // Cabeza (hexagono)
                0, -70,
                60, -35,
                60, 35,
                0, 70,
                -60, 35,
                -60, -35,
                
                // Ojo izquierdo (cuadrado)
                -35, -25,
                -25, -25,
                -25, -15,
                -35, -15,
                
                // Ojo derecho (cuadrado)
                25, -25,
                35, -25,
                35, -15,
                25, -15,
                
                // Boca (rectsngulo ancho)
                -40, 20,
                -40, 30,
                40, 30,
                40, 20,

                // Diente izquierdo (FALTABA COLOCAR LA POSICION DE LOS DIENTES QUE NO SE GUARDO)
                -20, 20,
                -10, 20,
                -10, 30,
                -20, 30,

                // Diente derecho
                10, 20,
                20, 20,
                20, 30,
                10, 30
            ]
        },
        a_color: {
            numComponents: 4,
            data: [
                // Cabeza (verde claro)
                0.4, 0.9, 0.4, 1,
                0.4, 0.9, 0.4, 1,
                0.4, 0.9, 0.4, 1,
                0.4, 0.9, 0.4, 1,
                0.4, 0.9, 0.4, 1,
                0.4, 0.9, 0.4, 1,
                
                // Ojo izquierdo (negro)
                0, 0, 0, 1,
                0, 0, 0, 1,
                0, 0, 0, 1,
                0, 0, 0, 1,
                
                // Ojo derecho (negro)
                0, 0, 0, 1,
                0, 0, 0, 1,
                0, 0, 0, 1,
                0, 0, 0, 1,
                
                // Boca (rojo)
                0.8, 0.1, 0.1, 1,
                0.8, 0.1, 0.1, 1,
                0.8, 0.1, 0.1, 1,
                0.8, 0.1, 0.1, 1,
                
                // Diente izquierdo (blanco)
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                
                // Diente derecho (blanco)
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1,
                1, 1, 1, 1
            ]
        },
        indices: {
            numComponents: 3,
            data: [
                // Cabeza (hexagono)
                0, 1, 5,
                1, 2, 5,
                2, 3, 4,
                2, 4, 5,
                
                // Ojo izquierdo
                6, 7, 8,
                8, 9, 6,
                
                // Ojo derecho
                10, 11, 12,
                12, 13, 10,
                
                // Boca
                14, 15, 16,
                16, 17, 14,
                
                // Diente izquierdo
                18, 19, 20,
                20, 21, 18,
                
                // Diente derecho
                22, 23, 24,
                24, 25, 22
            ]
        }
    };

    return arrays;
}


function buildPivotMarker() {
    let arrays = {
        a_position: {
            numComponents: 2,
            data: [
                // Triangulo
                0, -15,
                15, 15,
                -15, 15
            ]
        },
        a_color: {
            numComponents: 4,
            data: [
                // Rojo brillante
                1, 0, 0, 1,
                1, 0, 0, 1,
                1, 0, 0, 1
            ]
        },
        indices: {
            numComponents: 3,
            data: [
                0, 1, 2
            ]
        }
    };

    return arrays;
}


function main() {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');

    const programInfo = twgl.createProgramInfo(gl, [vsGLSL, fsGLSL]);

    const smileyGeometry = buildSmileyGeometry();
    const pivotGeometry = buildPivotMarker();

    const smileyBufferInfo = twgl.createBufferInfoFromArrays(gl, smileyGeometry);
    const pivotBufferInfo = twgl.createBufferInfoFromArrays(gl, pivotGeometry);

    const smileyVAO = twgl.createVAOFromBufferInfo(gl, programInfo, smileyBufferInfo);
    const pivotVAO = twgl.createVAOFromBufferInfo(gl, programInfo, pivotBufferInfo);

    const transformParams = {
        anchorX: 400,
        anchorY: 300,
        
        objectWorldX: 500,
        objectWorldY: 350,
        rotationDegrees: 0,
        scaleFactorX: 1.0,
        scaleFactorY: 1.0
    };

    const gui = new GUI();
    
    const anchorFolder = gui.addFolder('Pivot Anchor (Independent)');
    anchorFolder.add(transformParams, 'anchorX', 0, 800).name('Anchor X').onChange(() => render());
    anchorFolder.add(transformParams, 'anchorY', 0, 600).name('Anchor Y').onChange(() => render());
    anchorFolder.open();
    
    const objectFolder = gui.addFolder('Smiley Transformations');
    objectFolder.add(transformParams, 'objectWorldX', 0, 800).name('World X').onChange(() => render());
    objectFolder.add(transformParams, 'objectWorldY', 0, 600).name('World Y').onChange(() => render());
    objectFolder.add(transformParams, 'rotationDegrees', 0, 360).name('Rotation (deg)').onChange(() => render());
    objectFolder.add(transformParams, 'scaleFactorX', 0.1, 3.0).name('Scale X').onChange(() => render());
    objectFolder.add(transformParams, 'scaleFactorY', 0.1, 3.0).name('Scale Y').onChange(() => render());
    objectFolder.open();

    function render() {
        drawScene(gl, smileyVAO, pivotVAO, programInfo, smileyBufferInfo, pivotBufferInfo, transformParams);
    }

    render();
}


function drawScene(gl, smileyVAO, pivotVAO, programInfo, smileyBufferInfo, pivotBufferInfo, transformParams) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.9, 0.9, 0.9, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(programInfo.program);

    // Dibujar el marcador de pivote
    let anchorMatrix = M3.identity();
    anchorMatrix = M3.multiply(M3.translation([transformParams.anchorX, transformParams.anchorY]), anchorMatrix);

    let anchorUniforms = {
        u_resolution: [gl.canvas.width, gl.canvas.height],
        u_transforms: anchorMatrix
    };

    twgl.setUniforms(programInfo, anchorUniforms);
    gl.bindVertexArray(pivotVAO);
    twgl.drawBufferInfo(gl, pivotBufferInfo);

    
    const angleRad = transformParams.rotationDegrees * Math.PI / 180;
    
    // Calcular el offset del objeto respecto al pivote
    const offsetX = transformParams.objectWorldX - transformParams.anchorX;
    const offsetY = transformParams.objectWorldY - transformParams.anchorY;
    
    let objectMatrix = M3.identity();
    
    // Aplicar escala primero (transformacion local)
    objectMatrix = M3.multiply(M3.scale([transformParams.scaleFactorX, transformParams.scaleFactorY]), objectMatrix);
    
    // Trasladar a la posicion relativa del objeto respecto al pivote
    objectMatrix = M3.multiply(M3.translation([offsetX, offsetY]), objectMatrix);
    
    // Rotar alrededor del origen (donde esta el pivote conceptualmente)
    objectMatrix = M3.multiply(M3.rotation(angleRad), objectMatrix);
    
    // Trasladar al pivote (posicion final en el canvas)
    objectMatrix = M3.multiply(M3.translation([transformParams.anchorX, transformParams.anchorY]), objectMatrix);

    let objectUniforms = {
        u_resolution: [gl.canvas.width, gl.canvas.height],
        u_transforms: objectMatrix
    };

    twgl.setUniforms(programInfo, objectUniforms);
    gl.bindVertexArray(smileyVAO);
    twgl.drawBufferInfo(gl, smileyBufferInfo);
}

main();