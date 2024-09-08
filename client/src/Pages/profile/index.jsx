import { useAppStore } from "@/store/index"

const Profile = () => {
    const {userInfo} = useAppStore();
  return (
    <div>Profile
      <div>Email:{userInfo.email}</div>
    </div>
  )
}

export default Profile