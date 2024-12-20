import { THEME_STYLES } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { PriceChange } from "@/services/api";
import { formatCurrency } from "@/utils/priceCalculations";

interface PriceChangeDetailsProps {
  priceChange: PriceChange;
}

export const PriceChangeDetails = ({ priceChange }: PriceChangeDetailsProps) => {
  const { theme } = useTheme();
  const themeStyles = theme === 'dark' ? THEME_STYLES.dark : THEME_STYLES.light;

  return (
    <div className="mt-8">
      <h2 className={`text-xl font-semibold ${themeStyles.text} mb-4`}>Price Change Details</h2>
      <div className="space-y-4">
        <div className="flex justify-between py-3 border-b border-border">
          <span className={themeStyles.muted}>Current Price</span>
          <span className={`font-medium ${themeStyles.text}`}>
            {formatCurrency(priceChange.oldPrice)}
          </span>
        </div>
        <div className="flex justify-between py-3 border-b border-border">
          <span className={themeStyles.muted}>New Price</span>
          <span className={`font-medium ${themeStyles.text}`}>
            {formatCurrency(priceChange.newPrice)}
          </span>
        </div>
        <div className="flex justify-between py-3 border-b border-border">
          <span className={themeStyles.muted}>Change Date</span>
          <span className={`font-medium ${themeStyles.text}`}>
            {new Date(priceChange.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};