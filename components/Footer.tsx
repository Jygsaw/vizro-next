import React from "react";
import Link from "next/link";

const Footer = () => {
    return (
        <div className="flex flex-col ">
            <nav className="flex justify-center gap-5">
                <Link href="/about">About</Link>
            </nav>
            <div className="flex justify-center text-gray-600">
            &copy; 2023 Justin Cheung. All rights reserved.
            </div>
        </div>
    );
};

export default Footer;
