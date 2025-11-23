import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  page: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 260,
    gap: 16,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  headerActionSelected: {
    borderWidth: 1,
    borderColor: '#111827',
    backgroundColor: '#1118270D',
  },
  card: {
    borderRadius: 20,
    gap: 16,
  },
  fullHeightCard: {
    flexGrow: 1,
    alignSelf: 'stretch',
    minHeight: 0,
  },
  cardMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  editor: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 220,
    flex: 0,
  },
  sheetBackground: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    backgroundColor: '#fff',
  },
  sheetIndicator: {
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#D1D5DB',
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 20,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 13,
    color: '#374151',
  },
  sheetButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontWeight: '600',
    color: '#111827',
  },
  primaryButton: {
    flex: 1.4,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#F3F4F6',
  },
  primaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  ghostButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostButtonText: {
    fontWeight: '600',
    color: '#fff',
  },
  xCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  xAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },
  xContent: {
    flex: 1,
    gap: 12,
  },
  xHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  xHeaderText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  xUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F1419',
  },
  xUserMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  xEditor: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: '#0F1419',
    flex: 1,
    minHeight: 0,
  },
  xDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  xFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  xMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    flex: 1,
  },
  xMetaText: {
    fontSize: 13,
    color: '#6B7280',
  },
  xSeparatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
  },
  xFooterActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
});

