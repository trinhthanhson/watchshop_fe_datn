import { Result } from 'postcss'
import ColumnChartStatistics from '../../components/ColumnChartStatistics'
import RecentActualInventory from '../../components/inventory/RecentActualInventory'
import RecentRevenueProduct from '../../components/inventory/RecentRevenueProduct'
import NewCustomers from '../../components/NewCustomers'
import PieChartStatistics from '../../components/PieChartStatistics'
import RecentOrder from '../../components/RecentOrder'
import ResultAi from '../../components/ResultAi'
import DashboardStatisGrid from '../../components/inventory/DashboardStatisGrid'

const DashboardInventory = () => {
  return (
    <div className="flex flex-col gap-4 w-[80%] ml-[19%]">
      <DashboardStatisGrid />
      <div className="flex flex-row gap-4 w-full ">
        <ColumnChartStatistics />
      </div>
      <div className="md:w-3/3">
        <PieChartStatistics />
      </div>

      <div className="flex flex-row gap-4 w-full">
        <ResultAi />
      </div>
      <RecentActualInventory />
      <RecentRevenueProduct />
    </div>
  )
}

export default DashboardInventory
