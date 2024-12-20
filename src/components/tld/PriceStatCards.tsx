import { formatCurrency, formatNumber } from "@/utils/priceCalculations";
import { THEME_STYLES } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { PriceChange } from "@/services/api";

interface PriceStatCardsProps {
  priceChange: PriceChange;
  additionalRevenue: number;
}

export const PriceStatCards = ({ priceChange, additionalRevenue }: PriceStatCardsProps) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? THEME_STYLES.dark : THEME_STYLES.light;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
          <p className={`text-sm ${themeStyles.muted} mb-1`}>Current Price</p>
          <p className={`text-2xl font-bold ${themeStyles.text}`}>
            {formatCurrency(priceChange.oldPrice)}
          </p>
        </div>

        <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
          <p className={`text-sm ${themeStyles.muted} mb-1`}>Price Change</p>
          <p className={`text-2xl font-bold ${priceChange.priceChange > 0 ? "text-danger" : "text-success"}`}>
            {formatCurrency(Math.abs(priceChange.priceChange))}
          </p>
        </div>

        <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
          <p className={`text-sm ${themeStyles.muted} mb-1`}>New Price</p>
          <p className={`text-2xl font-bold ${themeStyles.text}`}>
            {formatCurrency(priceChange.newPrice)}
          </p>
        </div>
      </div>

      {priceChange.domainCount && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
            <p className={`text-sm ${themeStyles.muted} mb-1`}>Total Domains</p>
            <p className={`text-2xl font-bold ${themeStyles.text}`}>
              {formatNumber(priceChange.domainCount)}
            </p>
          </div>

          <div className="p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border">
            <p className={`text-sm ${themeStyles.muted} mb-1`}>Additional Revenue</p>
            <p className={`text-2xl font-bold ${themeStyles.text}`}>
              {formatCurrency(additionalRevenue)}
            </p>
          </div>
        </div>
      )}
    </>
  );
};