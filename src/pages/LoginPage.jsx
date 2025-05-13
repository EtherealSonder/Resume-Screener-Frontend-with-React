import React from "react";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Log in</h2>
                <input className="w-full mb-4 p-2 border rounded" placeholder="Email" />
                <input className="w-full mb-4 p-2 border rounded" placeholder="Password" type="password" />
                <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
                <p className="text-sm mt-4">Don’t have an account? <a href="/signup" className="text-blue-600">Sign up</a></p>
            </div>
        </div>
    );
}