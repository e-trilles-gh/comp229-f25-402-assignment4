import { Link } from "react-router-dom";    

export default function About() {
    return (
        <>
            <h2>About</h2>
            <div className="leftMessage">Welcome to my About Page</div>
            <div className="homeGrid">
                <div>
                    <h3>Eskim Trilles</h3>
                    <p>Aspiring Software Engineer with a Bachelor’s degree in Nursing, seeking to transition into technology by leveraging my problem-solving skills, attention to detail, and passion for innovation. Committed to bringing diverse perspectives from healthcare and patient care to deliver thoughtful, impactful solutions in software development. Eager to contribute to dynamic teams while continuing to grow my technical expertise and create meaningful products that make a difference.</p>
                </div>
                <div>
                    <h4>Experience</h4>
                    <ul>
                        <li>Developed a web application using JavaScript for interactivity.</li>
                        <li>Collaborated on a project involving deployment andmanagement of different servers.</li>
                        <li>Created a Software Requirement Specification document for a team project, demonstrating understanding of requirements analysis and documentation.</li>
                    </ul>
                </div>
                <div>
                    <h4>Skills</h4>
                    <ul>
                        <li>
                            <dl>
                                <dt>Programming Language:</dt>
                                <dd>C#, Java, JavaScript, Python</dd>
                            </dl>
                        </li>
                        <li>
                            <dl>
                                <dt>Web Development:</dt>
                                <dd>HTML, CSS, JS</dd>
                            </dl>
                        </li>
                        <li>
                            <dl>
                                <dt>Database:</dt>
                                <dd>Oracle 12c</dd>
                            </dl>
                        </li>
                        <li>
                            <dl>
                                <dt>Software Engineering Practices:</dt>
                                <dd>Object-Oriented Programming, Agile Methodologies</dd>
                            </dl>
                        </li>
                        <li>Attention to detail</li>
                        <li>Team player</li>
                        <li>Healthcare knowledge</li>
                        <li>Medical documentation</li>
                        <li>Maintaining patient data confidentiality</li>
                    </ul>
                    
                </div>
                <div>
                    <Link to="/pdf-view">View Resume</Link>
                </div>
            </div>
            
        </>
    )
}