import UpdateProfile from '../components/dashboard/UpdateProfile';
import Layout from '../components/layout';

export default function Profile() {
  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Profile</h1>
      <hr />
      <div className="mt-5">
        <UpdateProfile />
      </div>
    </Layout>
  );
}
