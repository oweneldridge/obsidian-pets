/*
 * Falling leaves effect
 * Based on https://github.com/tonybaloney/vscode-pets
 */
import { PetSize } from "../types";
import { Effect } from "./effect";

class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

function floorRandom(min: number, max: number): number {
    return (min || 0) + Math.random() * ((max || 1) - (min || 0));
}

function microtime(): number {
    return new Date().getTime() * 0.001;
}

class Leaf {
    origin: Vector2;
    position: Vector2;
    velocity: Vector2;
    size: number;
    amplitude: number;
    dx: number;
    rotation: number;
    rotationSpeed: number;
    color: string;
    settled: boolean;
    settleTime: number;
    settleDuration: number;

    constructor(
        origin: Vector2,
        velocity: Vector2,
        size: number,
        amplitude: number,
        rotationSpeed: number,
        color: string
    ) {
        this.origin = origin;
        this.position = new Vector2(origin.x, origin.y);
        this.velocity = velocity || new Vector2(0, 0);
        this.size = size;
        this.amplitude = amplitude;
        this.rotationSpeed = rotationSpeed;
        this.color = color;
        this.settled = false;
        this.settleTime = 0;
        this.settleDuration = floorRandom(4, 7); // Rest for 4-7 seconds

        // randomize start values a bit
        this.dx = Math.random() * 100;
        this.rotation = Math.random() * Math.PI * 2;
    }

    update(timeDelta: number): void {
        if (this.settled) {
            this.settleTime += timeDelta;
            return;
        }

        this.position.y += this.velocity.y * timeDelta;

        // oscillate the x value between -amplitude and +amplitude
        this.dx += this.velocity.x * timeDelta;
        this.position.x = this.origin.x + this.amplitude * Math.sin(this.dx);

        // rotate the leaf as it falls
        this.rotation += this.rotationSpeed * timeDelta;
    }
}

export class LeafEffect implements Effect {
    name: string = 'Leaves';
    description: string = 'Falling autumn leaves effect';

    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D;
    particles: Array<Leaf> = [];
    running: boolean = false;

    startTime: number = 0;
    frameTime: number = 0;
    maxTimeDelta: number = 0.1;

    pAmount: number = 50; // Number of leaves
    pSize: number[] = [10, 15]; // min and max size
    pSwing: number[] = [0.1, 1]; // min and max oscillation speed for x movement
    pSpeed: number[] = [10, 30]; // min and max y speed
    pAmplitude: number[] = [5, 20]; // min and max distance for x movement
    pRotationSpeed: number[] = [0.5, 2]; // min and max rotation speed

    leafColors: string[] = ['#D7A50F', '#704910', '#A22D16', '#BB8144'];
    treeLineHeight: number = 0;
    floor: number = 0;

    enable(): void {
        this.running = true;
        this.startTime = this.frameTime = microtime();
        this.loop();
    }

    disable(): void {
        this.running = false;
    }

    init(
        foregroundCanvas: HTMLCanvasElement,
        backgroundCanvas: HTMLCanvasElement,
        scale: PetSize,
        floor: number,
        isDarkTheme: boolean
    ): void {
        this.canvas = foregroundCanvas;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        this.floor = floor;

        switch (scale) {
            case PetSize.nano:
                this.pSize = [7, 10];
                this.pAmount = 100;
                this.treeLineHeight = 93.5;
                break;
            case PetSize.small:
                this.pSize = [10, 15];
                this.pAmount = 50;
                this.treeLineHeight = 120;
                break;
            case PetSize.medium:
                this.pSize = [13, 18];
                this.pAmount = 25;
                this.treeLineHeight = 187.5;
                break;
            case PetSize.large:
                this.pSize = [17, 24];
                this.pAmount = 15;
                this.treeLineHeight = 250;
                break;
        }
        this.initParticles();
    }

    loop(): void {
        if (this.running) {
            this.clear();
            this.update();
            this.draw();
            this.queue();
        }
    }

    private initParticles(): void {
        if (!this.canvas) {
            console.warn('Canvas not initialized');
            return;
        }
        // clear the particles array
        this.particles.length = 0;

        for (let i = 0; i < this.pAmount; i++) {
            const origin = new Vector2(
                floorRandom(0, this.canvas.width),
                floorRandom(-this.canvas.height, this.treeLineHeight)
            );
            const velocity = new Vector2(
                floorRandom(this.pSwing[0], this.pSwing[1]),
                floorRandom(this.pSpeed[0], this.pSpeed[1])
            );
            const size = floorRandom(this.pSize[0], this.pSize[1]);
            const amplitude = floorRandom(this.pAmplitude[0], this.pAmplitude[1]);
            const rotationSpeed = floorRandom(
                this.pRotationSpeed[0],
                this.pRotationSpeed[1]
            );
            const color =
                this.leafColors[
                    Math.floor(Math.random() * this.leafColors.length)
                ];

            this.particles.push(
                new Leaf(origin, velocity, size, amplitude, rotationSpeed, color)
            );
        }
    }

    private update(): void {
        if (!this.canvas) {
            console.warn('Canvas not initialized');
            return;
        }
        // calculate the time since the last frame
        const timeNow = microtime();
        const timeDelta = Math.min(timeNow - this.frameTime, this.maxTimeDelta);

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            particle.update(timeDelta);

            // check if leaf has reached the floor
            if (
                !particle.settled &&
                particle.position.y + particle.size >=
                    this.canvas.height - this.floor
            ) {
                particle.settled = true;
                particle.settleTime = 0;
            }

            // check if leaf has settled long enough to recycle
            if (particle.settled && particle.settleTime >= particle.settleDuration) {
                particle.settled = false;
                particle.position.y = -particle.size;
                particle.position.x = particle.origin.x =
                    Math.random() * this.canvas.width;
                particle.dx = Math.random() * 100;
                particle.rotation = Math.random() * Math.PI * 2;
                particle.settleDuration = floorRandom(4, 7);
            }
        }

        // save this time for the next frame
        this.frameTime = timeNow;
    }

    private draw(): void {
        if (!this.ctx) {
            console.warn('Canvas context not initialized');
            return;
        }

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];

            // save the current context state
            this.ctx.save();

            // move to the center of the leaf
            const centerX = particle.position.x + particle.size / 2;
            const centerY = particle.position.y + particle.size / 2;

            // translate to center, rotate, then translate back
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(particle.rotation);
            this.ctx.translate(-centerX, -centerY);

            // draw the leaf shape
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();

            // simple leaf shape using bezier curves
            const x = particle.position.x;
            const y = particle.position.y;
            const size = particle.size;

            this.ctx.moveTo(x + size / 2, y);
            this.ctx.quadraticCurveTo(
                x + size,
                y + size / 3,
                x + size / 2,
                y + size
            );
            this.ctx.quadraticCurveTo(x, y + size / 3, x + size / 2, y);

            this.ctx.fill();

            // restore the context state
            this.ctx.restore();
        }
    }

    private clear(): void {
        if (!this.ctx || !this.canvas) {
            console.warn('Canvas or context not initialized');
            return;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private queue(): void {
        window.requestAnimationFrame(() => this.loop());
    }

    handleResize(): void {
        return;
    }
}
