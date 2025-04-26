declare module "*.png" {
    const value: StaticImageData;
    export default value;
}

declare module "*.jpg" {
    const value: StaticImageData;
    export default value;
}

declare module "*.jpeg" {
    const value: StaticImageData;
    export default value;
}

declare module "*.webp" {
    const value: StaticImageData;
    export default value;
}

declare module "*.svg" {
    import React from "react";
    const value: React.FC<React.SVGProps<SVGSVGElement>>;
    export default value;
}

declare module "*.gif" {
    const value: StaticImageData;
    export default value;
}

declare module "*.avif" {
    const value: StaticImageData;
    export default value;
}