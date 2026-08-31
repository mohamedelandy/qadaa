/** @format */
/**
 * Compatibility wrapper delegating to PageSheet's Sheet component.
 */
import { Sheet } from "@components/PageSheet/PageSheet";
export function BottomSheet({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Sheet visible={visible} onClose={onClose}>
      {children}
    </Sheet>
  );
}
