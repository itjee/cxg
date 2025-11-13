"""FAM 모듈 - 모든 테이블 모델 정의

3개의 테이블 모델을 포함합니다.
"""


from .asset_depreciation import AssetDepreciation
from .asset_disposals import AssetDisposals
from .fixed_assets import FixedAssets

__all__ = [
    "AssetDepreciation",
    "AssetDisposals",
    "FixedAssets",
]
