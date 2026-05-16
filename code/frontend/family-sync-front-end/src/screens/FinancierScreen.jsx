import FinancierView from "../components/features/Financier/FinancierView.jsx";
import { useFinancier } from "../hooks/useFinancier";

function FinancierScreen() {
  const financierProps = useFinancier();

  return <FinancierView {...financierProps} />;
}

export default FinancierScreen;
