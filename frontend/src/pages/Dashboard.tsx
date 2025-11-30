import { useQuery } from 'react-query';

import RecentCourses from '../components/dashboard/RecentCourses';
import Layout from '../components/layout';
import useAuth from '../hooks/useAuth';
import statsService from '../services/StatsService';

export default function Dashboard() {
  const { authenticatedUser } = useAuth();
  const isAdmin = authenticatedUser?.role === 'admin';
  const { data, isLoading } = useQuery('stats', statsService.getStats);

  return (
    <Layout>
      <h1 className="font-semibold text-3xl mb-5">Dashboard</h1>
      <hr />
      <div className="mt-5 flex flex-col gap-5">
        {!isLoading ? (
          <div className="flex flex-col sm:flex-row gap-5">
            {isAdmin && (
              <div className="card shadow text-white bg-blue-500 flex-1">
                <h1 className="font-semibold sm:text-4xl text-center mb-3">
                  {data.numberOfUsers}
                </h1>
                <p className="text-center sm:text-lg font-semibold">Users</p>
              </div>
            )}
            <div className="card shadow text-white bg-indigo-500 flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data.numberOfCourses}
              </h1>
              <p className="text-center sm:text-lg font-semibold">Courses</p>
            </div>
            <div className="card shadow text-white bg-green-500 flex-1">
              <h1 className="font-semibold sm:text-4xl mb-3 text-center">
                {data.numberOfContents}
              </h1>
              <p className="text-center sm:text-lg font-semibold">Contents</p>
            </div>
          </div>
        ) : null}

        <RecentCourses courses={data?.latestCourses || []} />
      </div>
    </Layout>
  );
}
