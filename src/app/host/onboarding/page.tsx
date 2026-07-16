import { ListingWizard } from "@/components/listing-wizard";
import { hostContext } from "@/lib/host-context";
export default async function OnboardingPage(){const{organizationId}=await hostContext({allowEmpty:true});return <ListingWizard existingOrganizationId={organizationId||""}/>}
