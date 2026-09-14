import React, { useRef, useState, useEffect } from "react";
import { useAuth } from "@clerk/react";

import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const ref = useRef();
  const passwordRef = useRef();
  const saveIconRef = useRef();

  const { getToken } = useAuth();

  const [form, setform] = useState({
    site: "",
    username: "",
    password: "",
  });

  const [passwordArray, setpasswordArray] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  
  // Get passwords
  
  const getPasswords = async () => {
    try {
      const token = await getToken();

      const req = await fetch(`${API_URL}/passwords`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!req.ok) {
        throw new Error("Failed to fetch passwords");
      }

      const passwords = await req.json();

      setpasswordArray(passwords);
    } catch (error) {
      console.error(error);

      toast.error("Failed to load passwords", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    getPasswords();
  }, []);

  
  // Show or Hide passwords
  
  const showPassword = () => {
    if (ref.current.src.includes("icons/eye.png")) {
      ref.current.src = "/icons/eyecross.png";
      passwordRef.current.type = "password";
    } else {
      ref.current.src = "/icons/eye.png";
      passwordRef.current.type = "text";
    }
  };

  
  // Save passwords
  
  const savePassword = async () => {
    if (
      form.site.length > 3 &&
      form.username.length > 3 &&
      form.password.length > 3
    ) {
      try {
        saveIconRef.current?.playerInstance?.playFromBeginning();

        const token = await getToken();

        
        // Edit existing password
        
        if (form.id) {
          const deleteResponse = await fetch(
            `${API_URL}/passwords/${form.id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!deleteResponse.ok) {
            throw new Error("Failed to remove old password");
          }
        }

        
        // Create new password
        
        const newPassword = {
          ...form,
          id: uuidv4(),
        };

        const response = await fetch(
          `${API_URL}/passwords`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newPassword),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to save password");
        }

        const savedPassword = await response.json();

        
        if (form.id) {
          setpasswordArray((prev) => [
            ...prev.filter((item) => item.id !== form.id),
            savedPassword,
          ]);
        } else {
          setpasswordArray((prev) => [
            ...prev,
            savedPassword,
          ]);
        }

        
        setform({
          site: "",
          username: "",
          password: "",
        });

        toast("Password saved!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

      } catch (error) {
        console.error(error);

        toast.error("Error: Password not saved!", {
          position: "top-right",
          autoClose: 2000,
          theme: "dark",
        });
      }

    } else {
      toast("Error: Password not saved!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  
  // Edit password
  
  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find(
      (item) => item.id === id
    );

    if (!passwordToEdit) {
      return;
    }

    setform({
      ...passwordToEdit,
      id,
    });

    setpasswordArray(
      passwordArray.filter((item) => item.id !== id)
    );
  };

  
  // Delete password
  
  const deletePassword = async (id) => {
    const c = confirm(
      "Do you really want to delete the password"
    );

    if (!c) {
      return;
    }

    try {
      const token = await getToken();

      const response = await fetch(
        `${API_URL}/passwords/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete password");
      }

      const newPasswords = passwordArray.filter(
        (item) => item.id !== id
      );

      setpasswordArray(newPasswords);

      toast("Password deleted!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

    } catch (error) {
      console.error(error);

      toast.error("Failed to delete password", {
        position: "top-right",
        autoClose: 2000,
        theme: "dark",
      });
    }
  };

  
  const handleChange = (e) => {
    setform({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  
  // Copy text
  
  const copyText = (text) => {
    navigator.clipboard.writeText(text);

    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />

      <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 md:px-12 lg:px-40">

        <h1 className="font-bold text-4xl text-center">
          <span className="text-green-600">&lt;</span>
          <span>Pass</span>
          <span className="text-green-600">OP/&gt;</span>
        </h1>

        <p className="text-green-900 text-lg text-center">
          Your Password Manager
        </p>

        <div className="text-black flex flex-col justify-center py-2 gap-4 items-center">

          
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Enter Website URL"
            className="rounded-lg border border-green-500 w-full px-4 py-1"
            type="text"
            name="site"
            id="site"
          />

          <div className="flex w-full flex-col gap-4 md:flex-row md:gap-8">

           
            <input
              value={form.username}
              onChange={handleChange}
              placeholder="Enter Username"
              className="w-full rounded-lg border border-green-500 px-4 py-1"
              type="text"
              name="username"
              id="username"
            />

            
            <div className="relative w-full">

              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full rounded-lg border border-green-500 px-4 py-1"
                type="password"
                name="password"
                id="password"
              />

              <span
                className="absolute right-0.75 top-1 cursor-pointer"
                onClick={showPassword}
              >
                <img
                  ref={ref}
                  className="p-1"
                  width={26}
                  src="/icons/eyecross.png"
                  alt="eye"
                />
              </span>

            </div>
          </div>

          
          <button
            onClick={savePassword}
            className="flex cursor-pointer justify-center items-center bg-green-500 hover:bg-green-400 rounded-full w-fit px-4 py-2 gap-1 border-2 border-green-900"
          >
            <lord-icon
              ref={saveIconRef}
              src="/add.json"
              style={{
                width: "40px",
                height: "40px",
              }}
            />

            <div>Save Password</div>
          </button>

        </div>


        <div className="passwords">

          <h1 className="text-2xl font-bold py-4">
            Your Passwords
          </h1>

          {passwordArray.length === 0 && (
            <div>No passwords to show</div>
          )}

          {passwordArray.length !== 0 && (
            <div className="md:my-5 my-2 w-full rounded-lg">

              <table className="table-fixed w-full text-xs sm:text-sm">

                <thead className="bg-green-800 text-white">
                  <tr>
                    <th className="w-[28%] py-2">
                      Site
                    </th>

                    <th className="w-[26%] py-2">
                      Username
                    </th>

                    <th className="w-[26%] py-2">
                      Password
                    </th>

                    <th className="w-[20%] py-2">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-green-200">

                  {passwordArray.map((item) => (
                    <tr key={item.id}>

                      <td className="py-2 border border-white text-center">

                        <div className="flex items-center justify-between gap-1 px-2 sm:px-3 md:px-5">

                          <a
                            className="break-all min-w-0"
                            href={item.site}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.site}
                          </a>

                          <div
                            className="cursor-pointer shrink-0"
                            onClick={() => {
                              copyText(item.site);
                            }}
                          >
                            <lord-icon
                              src="/copy.json"
                              trigger="hover"
                              style={{
                                width: "20px",
                                height: "20px",
                                padding: "3px",
                              }}
                            />
                          </div>

                        </div>

                      </td>

                      <td className="py-2 border border-white text-center">

                        <div className="flex items-center justify-between gap-1 px-2 sm:px-3 md:px-5">

                          <span className="break-all min-w-0">
                            {item.username}
                          </span>

                          <div
                            className="cursor-pointer shrink-0"
                            onClick={() => {
                              copyText(item.username);
                            }}
                          >
                            <lord-icon
                              src="/copy.json"
                              trigger="hover"
                              style={{
                                width: "20px",
                                height: "20px",
                                padding: "3px",
                              }}
                            />
                          </div>

                        </div>

                      </td>

                      <td className="py-2 border border-white text-center">

                        <div className="flex items-center justify-between gap-1 px-2 sm:px-3 md:px-5">

                          <span className="break-all min-w-0">
                            {item.password}
                          </span>

                          <div
                            className="cursor-pointer shrink-0"
                            onClick={() => {
                              copyText(item.password);
                            }}
                          >
                            <lord-icon
                              src="/copy.json"
                              trigger="hover"
                              style={{
                                width: "20px",
                                height: "20px",
                                padding: "3px",
                              }}
                            />
                          </div>

                        </div>

                      </td>

                      <td className="py-2 border border-white text-center">

                        <div className="flex justify-center items-center gap-3 sm:gap-3 md:gap-4">

                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              editPassword(item.id);
                            }}
                          >
                            <lord-icon
                              src="/edit.json"
                              trigger="hover"
                              style={{
                                width: "20px",
                                height: "20px",
                              }}
                            />
                          </span>

                          <span
                            className="cursor-pointer"
                            onClick={() => {
                              deletePassword(item.id);
                            }}
                          >
                            <lord-icon
                              src="/delete.json"
                              trigger="hover"
                              style={{
                                width: "20px",
                                height: "20px",
                              }}
                            />
                          </span>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </>
  );
};

export default Manager;