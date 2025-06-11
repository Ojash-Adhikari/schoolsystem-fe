import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import "../../assets/css/fluid.scss";

const Unauthorized = () => {
    return (
        <div className="fluid-body">
            <Helmet>
                <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.9/dat.gui.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
                <script src="fluid.js"></script>
            </Helmet>
            <canvas className="fluid-canvas" id="fluid"></canvas>
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="otp-container">
                    <h2 className="text-xl font-bold text-center">
                        Unauthorized Access Denind
                    </h2>
                    <h2 className="text-xl font-bold text-center">
                        But you can play around here.
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
