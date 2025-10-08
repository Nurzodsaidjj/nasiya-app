import background from "../../assets/images/bg.jpg";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  const containerStyles = {
    width: "1300px",
    height: "650px",
    backgroundColor: "#fff",
    placeItems: "center",
	margin: "50px auto",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    boxShadow:
      "rgba(255, 255, 255, 0.1) 0px 1px 1px 0px inset, rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
  };

  const backgroundStyles = {
    width: "50%",
    height: "100%",
    backgroundImage: `url(${background})`,
    backgroundSize: "cover",
    borderRadius: "0px 18px 18px 0px",
    backgroundPosition: "center",
  };
  return (
    <div style={containerStyles}>
      {children} <div style={backgroundStyles} />
    </div>
  );
};

export default Layout;
