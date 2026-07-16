import { HostShell } from "@/components/host-shell";
import { hostContext } from "@/lib/host-context";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
export const dynamic="force-dynamic"; export const metadata={title:{default:"Host CRM",template:"%s | StayRwanda Host"}};
export default async function HostLayout({children}:{children:React.ReactNode}){const{organizationId}=await hostContext({allowEmpty:true});let name="Create your organization";if(organizationId&&ObjectId.isValid(organizationId)){const db=await getDb();name=(await db.collection("organizations").findOne({_id:new ObjectId(organizationId)}))?.name||"Hospitality workspace"}return <HostShell organizationName={name}>{children}</HostShell>}
