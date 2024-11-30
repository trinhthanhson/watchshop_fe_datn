import ColumnChartStatistics from '../components/ColumnChartStatistics'
import DashboardStatisGrid from '../components/DashboardStatisGrid'
import PieChartStatistics from '../components/PieChartStatistics'
import RecentOrder from '../components/RecentOrder'
import NewCustomers from '../components/NewCustomers'
import RecentActualInventory from '../components/inventory/RecentActualInventory'
import RecentRevenueProduct from '../components/inventory/RecentRevenueProduct'

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 w-[80%] ml-[18%]">
      <DashboardStatisGrid />
      <div className="flex flex-row gap-4 w-full">
        <ColumnChartStatistics />
      </div>
      <div className="flex justify-between w-full md:space-x-4 ">
        <div className="md:w-2/3">
          <PieChartStatistics />
        </div>
        <div className="md:w-1/3">
          <NewCustomers />
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <RecentOrder />
      </div>
      <RecentActualInventory />
      <RecentRevenueProduct />
    </div>
  )
}

export default Dashboard
