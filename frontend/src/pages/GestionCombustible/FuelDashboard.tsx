import GeneralSummary from './dashboard/GeneralSummary'
import VehicleAnalysis from './dashboard/VehicleAnalysis'
import DateAnalysis from './dashboard/DateAnalysis'
import WeekdayConsumption from './dashboard/WeekdayConsumption'
import HourlyRefuelDistribution from './dashboard/HourlyRefuelDistribution'
import { Combustible } from '@/types/combustible'

interface FuelDashboardProps {
  records: Combustible[]
}



export default function FuelDashboard({ records }: FuelDashboardProps) {
    
  return (
    <div className="space-y-6">
      <GeneralSummary records={records} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VehicleAnalysis records={records} />
        <DateAnalysis records={records} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeekdayConsumption records={records} />
        <HourlyRefuelDistribution records={records} />
      </div>
    </div>
  )
}

