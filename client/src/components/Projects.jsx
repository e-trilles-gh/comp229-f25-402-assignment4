import { useState, useEffect } from "react";

export default function Projects() {

  // creates an array that holds the image file names
  const images = [
    "mainUI.png",
    "equipmentPage.png",
    "orderPage.png",
    "calculator.png",
    "locationPage.png",
    "javaApp.png",
    "menuList.png",
  ];

  // creates an array that holds caption for each image
  const captions = [
    "First Main UI",
    "Equipment Page",
    "Order Page",
    "Calculator App - C#",
    "Location Page",
    "Guessing App - Java",
    "Menu List",
  ];

  // creates an array that holds description for each image
  const descriptions = [
    "This is the main UI of my past projects.",
    "Equipment page displays photos. Clicking on a photo opens the corresponding detail page. Each detail page can hold descriptions and more images.",
    "Order page displays UI where the customer can place their order and provide the total amount.",
    "This simple calculator app was written using C# programming language. The app calculates two fractions.",
    "Location page uses the google API to calculate the distance of the user and provides different options on how the direction will be provided.",
    "This is a simple guessing app that generates a random number and the user tries to identify it. The app was written using the Java programming language.",
    "The menu list displays photos of the items and its prices. When the user hovers on each photo, additional information is shown to the user.",
  ];

  // stores and sets the index, and initializes the index to 0
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageCount = images.length;

  // ensures that if the array reaches the last item, it will return back to 0
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % imageCount);

  // ensures that if the array reaches the first item, it will return back to the last index
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + imageCount) % imageCount);

  const [showForm, setShowForm] = useState(false);
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    firstname: "",
    lastname: "",
    email: "",
    completion: "",
    description: ""
  });

  const startEditing = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      firstname: item.firstname,
      lastname: item.lastname,
      email: item.email,
      completion: item.completion?.split("T")[0],
      description: item.description
    });
    setShowForm(true);
  };
  
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  const fetchProjects = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Check your credentials");
      setProjects([]);
      return;
    }

    try {
      const res = await fetch("/api/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        console.error("Unauthorized fetching contacts");
        setProjects([]);
        return;
      }

      const data = await res.json();

      setProjects(data);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  useEffect(() => {
    fetchProjects();

    const handleEvent = () => fetchContacts();

    window.addEventListener("userLogin", handleEvent);
    window.addEventListener("userLogout", handleEvent);

    return () => {
      window.removeEventListener("userLogin", handleEvent);
      window.removeEventListener("userLogout", handleEvent);
    }
  }, []);

  const submitProject = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `/api/projects/${editingId}`
      : "/api/projects";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        alert("Error saving data.");
        return;
      }

      alert(editingId ? "Updated successfully!" : "Saved successfully!");

      setFormData({
        title: "",
        firstname: "",
        lastname: "",
        email: "",
        completion: "",
        description: ""
      });

      setEditingId(null);
      setShowForm(false);
      fetchProjects();

    } catch (error) {
      console.error("Message:", error);
    }
  };

  const deleteProject = async (id) => {
    const token = localStorage.getItem("token");

    if (!confirm("Delete this item?")) {
      return;
    }


    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        alert("Deleted!");
        fetchProjects();
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  }



  return (
    <>
      <h2>Projects</h2>
      <div className="leftMessage">Welcome to my Projects Page</div>
      <div className="centerDiv">
        <div>
          {!showForm && (
            <button onClick={() => setShowForm(true)}>Add Project</button>
          )}
          {showForm && (
            <form onSubmit={submitProject}>
              <fieldset>
                <legend>Education Details</legend>
                <label className="block" htmlFor="title">Title:</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />

                <label className="block" htmlFor="firstname">First Name:</label>
                <input type="text" id="firstname" name="firstname" value={formData.firstname} onChange={handleChange} required />

                <label className="block" htmlFor="lastname">Last Name:</label>
                <input type="text" id="lastname" name="lastname" value={formData.lastname} onChange={handleChange} required />

                <label className="block" htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

                <label className="block" htmlFor="completion">Completion Date:</label>
                <input type="date" id="completion" name="completion" value={formData.completion} onChange={handleChange} required />

                <label className="block" htmlFor="description">Description:</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required />
              </fieldset>

              <fieldset>
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </fieldset>
            </form>
          )}
        </div>

        <div>
          <h3>Project List</h3>
        </div>
        {projects.length === 0 ? <p>No entries yet.</p> : (
          <>
            <table className="tableList">
              <thead>
                <tr>
                  <td><b>Title</b></td>
                  <td><b>Name</b></td>
                  <td><b>Completion Date</b></td>
                  <td><b>Description</b></td>
                  <td><b>Options</b></td>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className="project-card">
                    <td>{project.title}</td>
                    <td>{`${project.firstname} ${project.lastname}`}</td>
                    <td>{project.completion?.split("T")[0]}</td>
                    <td>{project.description}</td>
                    <td>
                      <button onClick={() => startEditing(project)}>Edit</button>
                      <button onClick={() => deleteProject(project._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        <div>

        </div>
      </div>
      <div className="homeGrid">
        <div id="gallerybox">
          <h3>{captions[currentIndex]}</h3>
          <div className="projectContainer">
            <button className="leftButton" onClick={prevSlide}>&#9664;</button>
            <img className="projectImage" src={`/images/${images[currentIndex]}`} alt={captions[currentIndex]} />
            <button className="rightButton" onClick={nextSlide}>&#9654;</button>
            <div className="imageCounter">
              {currentIndex + 1} / {imageCount}
            </div>
          </div>

          <p>{descriptions[currentIndex]}</p>
        </div>
      </div>
    </>
  )
}