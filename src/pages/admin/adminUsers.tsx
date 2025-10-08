import { Button } from "antd";
import { AdminTable } from "./admin-table";
import { useAdminQueryUsers } from "../../query/useAdminQueryUsers";
import { useNavigate } from "react-router-dom";

export const AdminUsers = () => {
  const nav = useNavigate()
  const { data, isLoading, error, isError } = useAdminQueryUsers();  
  if (isError) {
    return <h1>{error.message}</h1>;
  }
  return (
    <>
        <Button type="primary" onClick={()=>nav("/super-admin/admincard")}  style={{marginBottom:"10px"}}>createAdmin</Button>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <div>
        <AdminTable dataSource={data || []} />
        </div>
      )}   
    </>
  );
};